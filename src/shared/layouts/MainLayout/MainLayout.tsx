import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import PremiumBottomNavigation from "@/shared/ui/PremiumBottomNavigation";
import BackgroundEffects from "@/shared/ui/BackgroundEffects";
import JoinChannelsGate from "@/shared/ui/JoinChannelsGate";
import Skeleton from "@/shared/ui/Skeleton";
import { getMembershipStatus } from "@/shared/api/services";
import { useUserStore } from "@/shared/store/userStore";

import styles from "./MainLayout.module.css";

// 🐛 فیکس: قبلاً Mini App هیچ‌وقت شرط «عضویت اجباری در کانال‌ها» را (که در
// خود ربات همیشه با /start چک می‌شد) بررسی نمی‌کرد؛ کاربر می‌توانست بدون
// عضویت در کانال‌ها مستقیماً از این‌جا خرید کند. حالا همان قانون این‌جا هم
// یک‌بار در بالاترین سطح (قبل از رندر هر صفحه‌ای) چک می‌شود.
type MembershipState =
  | { status: "checking" }
  | { status: "joined" }
  | { status: "blocked"; channels: { name: string; url: string }[] }
  | { status: "error" };

export default function MainLayout() {
  const [membership, setMembership] = useState<MembershipState>({ status: "checking" });
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);
  const [rechecking, setRechecking] = useState(false);

  const check = useCallback(async () => {
    setRechecking(true);
    try {
      const res = await getMembershipStatus();
      if (res.joined) {
        setMembership({ status: "joined" });
      } else {
        setMembership({ status: "blocked", channels: res.channels || [] });
      }
    } catch {
      // اگر endpoint وضعیت عضویت هم در دسترس نبود، به‌جای گیر انداختن کامل
      // کاربر پشت یک صفحه‌ی خطا، اجازه می‌دهیم ادامه دهد؛ endpointهای واقعی
      // (که require_telegram_auth دارند) در هر صورت خودشان همین چک را دوباره
      // انجام می‌دهند.
      setMembership({ status: "error" });
    } finally {
      setRechecking(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <>
      <BackgroundEffects />

      <main className={styles.layout}>
        <div className={styles.container}>
          {membership.status === "checking" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 4px" }}>
              <Skeleton height={120} radius={24} />
              <Skeleton height={60} radius={18} />
              <Skeleton height={60} radius={18} />
            </div>
          ) : membership.status === "blocked" ? (
            <JoinChannelsGate
              channels={membership.channels}
              checking={rechecking}
              onRecheck={check}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {membership.status !== "blocked" && <PremiumBottomNavigation />}
    </>
  );
}
