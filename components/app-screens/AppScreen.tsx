import { HomeIndicator, ScreenIcon, StatusBar } from "./parts";

/**
 * Faithful, deliberately sparse reconstructions of the key TreePulse screens.
 *
 * The Expo/React Native app could not be launched here (no Android emulator or
 * device, and it depends on native camera / GPS / maps modules). Per the brief
 * these screens are rebuilt from the mobile source — same layout, same colour
 * tokens (src/theme/colors.ts), same Jost type, same in-app wording
 * (src/locales/translations/en.json) — with safe demo records only (no real
 * farmer, account, coordinate or payout data).
 *
 *   login ......... src/screens/OnboardingScreen.tsx
 *   dashboard ..... src/screens/SelectionScreen.tsx
 *   farms ......... src/screens/MyFarmsScreen.tsx
 *   earnings ...... src/screens/TreeStatusScreen.tsx
 *   notifications . src/screens/NotificationsScreen.tsx
 *
 * Root font-size is set in `cqi` (share of the phone display width); everything
 * else is in `em`, so the screen scales with the mockup at any size.
 */

export type ScreenName =
  | "login"
  | "dashboard"
  | "farms"
  | "earnings"
  | "notifications";

const shell =
  "flex h-full w-full flex-col overflow-hidden bg-bg text-[5.2cqi] leading-[1.5] text-ink";

export function AppScreen({ name }: { name: ScreenName }) {
  switch (name) {
    case "login":
      return <LoginScreen />;
    case "dashboard":
      return <DashboardScreen />;
    case "farms":
      return <FarmsScreen />;
    case "earnings":
      return <EarningsScreen />;
    case "notifications":
      return <NotificationsScreen />;
  }
}

function TopBtn({
  icon,
  accent = false,
  badge,
}: {
  icon: Parameters<typeof ScreenIcon>[0]["name"];
  accent?: boolean;
  badge?: string;
}) {
  return (
    <span
      className={`relative flex h-[2.2em] w-[2.2em] items-center justify-center rounded-[0.8em] border border-line bg-surface ${
        accent ? "text-primary-deep" : "text-ink"
      }`}
    >
      <ScreenIcon name={icon} className="h-[1.15em] w-[1.15em]" />
      {badge && (
        <span className="absolute -right-[0.3em] -top-[0.3em] flex h-[1.15em] min-w-[1.15em] items-center justify-center rounded-full border-2 border-surface bg-danger px-[0.2em] text-[0.62em] font-bold text-white">
          {badge}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ login -- */

function LoginScreen() {
  return (
    <div className={shell}>
      <StatusBar />
      <div className="flex flex-1 flex-col px-[2em] pt-[1.6em]">
        <p className="text-[0.72em] font-bold uppercase tracking-[0.28em] text-primary-deep">
          TreePulse
        </p>
        <p className="mt-[1.6em] text-[2em] font-black leading-[1.1] text-primary-deep">
          Welcome
        </p>
        <p className="mt-[0.5em] text-[0.85em] text-muted">
          Sign in to your TreePulse dashboard.
        </p>

        <div className="mt-[2em] space-y-[1em]">
          <LoginField label="Phone number or National ID" value="078 •• •• •••" />
          <LoginField label="Password" value="••••••••" icon="eye" />
        </div>

        <div className="mt-[1.6em] rounded-[1.1em] bg-primary py-[0.95em] text-center text-[0.95em] font-bold text-white shadow-card">
          Login
        </div>
        <p className="mt-[1em] text-center text-[0.78em] text-muted">
          New here? <span className="font-bold text-primary-deep">Create account</span>
        </p>
      </div>
      <LeafArt />
      <HomeIndicator />
    </div>
  );
}

function LoginField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: "eye";
}) {
  return (
    <div>
      <p className="mb-[0.4em] text-[0.72em] font-bold text-muted">{label}</p>
      <div className="flex h-[2.9em] items-center justify-between rounded-[0.9em] border-[1.5px] border-line bg-surface px-[1em]">
        <span className="text-[0.85em] text-ink/60">{value}</span>
        {icon && <ScreenIcon name="eye" className="h-[1.1em] w-[1.1em] text-muted" />}
      </div>
    </div>
  );
}

function LeafArt() {
  return (
    <div className="relative mt-[1.4em] h-[6em] overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 320 110"
        className="absolute inset-x-0 bottom-0 w-full"
        fill="none"
      >
        <path d="M0 54c46 24 96 28 154 10s110-38 166-12v58H0Z" fill="#ebf4ea" />
        <g
          stroke="#6eba6d"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M74 96V72M74 72c-11-2-18-11-18-22 11 0 20 7 20 18M74 78c9-2 16-9 16-20-10 0-18 7-18 16" />
          <path d="M244 96V70M244 70c-12-2-19-12-19-23 12 0 21 8 21 19M244 77c10-2 16-10 16-21-11 0-18 8-18 17" />
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------- dashboard -- */

function DashboardScreen() {
  return (
    <div className={shell}>
      <StatusBar />
      <div className="flex items-center justify-between px-[1.5em] pb-[0.5em]">
        <span className="w-[2.2em]" />
        <p className="text-[0.82em] font-bold">Selection Type</p>
        <div className="flex gap-[0.5em]">
          <TopBtn icon="bell" badge="2" />
          <TopBtn icon="settings" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[1.5em] pt-[1.2em]">
        <p className="text-[1.35em] font-black leading-[1.15]">
          What would you like to do today?
        </p>
        <p className="mt-[0.2em] text-[0.8em] text-muted">
          Choose an action to get started
        </p>

        <div className="mt-[1.4em] space-y-[0.8em]">
          <OptionRow
            icon="landmark"
            title="Farm Registration"
            subtitle="Map your farm boundaries"
            selected
          />
          <OptionRow
            icon="tree"
            title="Tree Registration"
            subtitle="Record and geo-tag new trees"
          />
          <OptionRow
            icon="wallet"
            title="My Trees & Earnings"
            subtitle="Status and RWF payouts"
          />
        </div>

        <div className="mt-auto pb-[0.4em] pt-[1.2em]">
          <div className="rounded-[1.1em] bg-primary py-[0.9em] text-center text-[0.95em] font-bold text-white shadow-card">
            Continue
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function OptionRow({
  icon,
  title,
  subtitle,
  selected = false,
}: {
  icon: "landmark" | "tree" | "wallet";
  title: string;
  subtitle: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-[0.9em] rounded-[1.3em] border-2 bg-surface p-[0.85em] ${
        selected
          ? "border-primary shadow-[0_0.7em_1.6em_-0.9em_rgba(78,138,76,0.4)]"
          : "border-transparent shadow-[0_0.5em_1.2em_-0.9em_rgba(15,23,42,0.18)]"
      }`}
    >
      <span
        className={`flex h-[2.5em] w-[2.5em] flex-none items-center justify-center rounded-[0.9em] ${
          selected ? "bg-primary/15 text-primary-deep" : "bg-bg text-muted"
        }`}
      >
        <ScreenIcon name={icon} className="h-[1.15em] w-[1.15em]" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[0.86em] font-bold ${
            selected ? "text-primary-deep" : "text-ink"
          }`}
        >
          {title}
        </p>
        <p className="truncate text-[0.7em] text-muted">{subtitle}</p>
      </div>
      <span
        className={`flex h-[1.4em] w-[1.4em] flex-none items-center justify-center rounded-full border-2 ${
          selected ? "border-primary" : "border-line"
        }`}
      >
        {selected && <span className="h-[0.65em] w-[0.65em] rounded-full bg-primary" />}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ farms -- */

function FarmsScreen() {
  return (
    <div className={shell}>
      <StatusBar />
      <div className="flex items-center justify-between px-[1.5em] pb-[0.5em]">
        <TopBtn icon="chevron-left" />
        <p className="text-[0.82em] font-bold">My Farms</p>
        <TopBtn icon="plus" accent />
      </div>

      <div className="px-[1.7em] pb-[0.6em] pt-[0.8em]">
        <p className="text-[1.3em] font-black">Registered Farms</p>
        <p className="text-[0.78em] text-muted">Your plots, area and tree counts</p>
      </div>

      <div className="min-h-0 flex-1 space-y-[0.9em] overflow-hidden px-[1.7em] pt-[0.4em]">
        <FarmCard name="Nyagatare A" status="Approved" meta="42 trees · 1.8 ha" />
        <FarmCard name="Kayonza Ridge" status="Pending" meta="18 trees · 0.6 ha" compact />
      </div>
      <HomeIndicator />
    </div>
  );
}

function FarmCard({
  name,
  status,
  meta,
  compact = false,
}: {
  name: string;
  status: "Approved" | "Pending";
  meta: string;
  compact?: boolean;
}) {
  const badge =
    status === "Approved"
      ? "bg-[#d1fae5] text-[#065f46]"
      : "bg-[#fef3c7] text-[#92400e]";
  return (
    <div className="rounded-[1.6em] border border-line/70 bg-surface p-[1.1em] shadow-[0_1em_2.2em_-1.4em_rgba(78,138,76,0.4)]">
      <div className="flex items-center gap-[0.7em]">
        <span className="flex h-[2.4em] w-[2.4em] flex-none items-center justify-center rounded-[0.8em] bg-primary/15 text-primary-deep">
          <ScreenIcon name="landmark" className="h-[1.1em] w-[1.1em]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.88em] font-bold">{name}</p>
          <p className="truncate text-[0.68em] text-muted">{meta}</p>
        </div>
        <span
          className={`flex-none rounded-[0.6em] px-[0.55em] py-[0.2em] text-[0.6em] font-bold ${badge}`}
        >
          {status}
        </span>
      </div>
      {!compact && (
        <div className="mt-[0.9em] flex items-center justify-center gap-[0.4em] rounded-[0.9em] bg-primary py-[0.6em] text-[0.66em] font-bold text-white">
          <ScreenIcon name="eye" className="h-[1em] w-[1em]" />
          View trees &amp; details
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- earnings -- */

function EarningsScreen() {
  return (
    <div className={shell}>
      <StatusBar />
      <div className="flex items-center justify-between px-[1.5em] pb-[0.6em]">
        <TopBtn icon="chevron-left" />
        <p className="text-[0.82em] font-bold">My Trees Status</p>
        <span className="w-[2.2em]" />
      </div>

      <div className="flex gap-[0.5em] px-[1.7em] pb-[0.9em]">
        <span className="rounded-full bg-primary px-[0.9em] py-[0.4em] text-[0.7em] font-bold text-white">
          All Plots
        </span>
        <span className="rounded-full border border-line bg-surface px-[0.9em] py-[0.4em] text-[0.7em] font-semibold text-muted">
          Nyagatare Plot A
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-[1.7em]">
        <div className="rounded-[1.7em] border border-[#c6dec3] bg-sage p-[1.3em]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[0.4em] text-[0.64em] font-bold uppercase tracking-[0.08em] text-muted">
              <ScreenIcon name="wallet" className="h-[1.15em] w-[1.15em] text-primary-deep" />
              Secure Wallet
            </span>
            <span className="flex items-center gap-[0.3em] rounded-full bg-primary/15 px-[0.55em] py-[0.2em] text-[0.58em] font-bold text-primary-deep">
              <ScreenIcon name="check-circle" className="h-[1em] w-[1em]" />
              Verified
            </span>
          </div>
          <p className="mt-[0.5em] whitespace-nowrap text-[2.05em] font-black leading-none">
            184,500 RWF
          </p>
          <p className="mt-[0.4em] text-[0.68em] text-muted">
            Payout across all registered plots
          </p>
          <div className="mt-[1.1em] flex rounded-[1.1em] border border-[#d2e6d0] bg-surface py-[0.85em]">
            <WalletStat label="Approved" value="37" />
            <span className="w-px bg-[#d2e6d0]" />
            <WalletStat label="Rejected" value="3" tone="text-danger" />
            <span className="w-px bg-[#d2e6d0]" />
            <WalletStat label="Pending" value="12" tone="text-amber" />
          </div>
        </div>

        <p className="mt-[1.2em] px-[0.2em] text-[0.8em] font-bold">Registered plots</p>
        <div className="mt-[0.6em] space-y-[0.6em]">
          <PlotRow name="Nyagatare Plot A" meta="42 trees · 1.8 ha" />
          <PlotRow name="Kayonza Ridge" meta="18 trees · 0.6 ha" />
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function WalletStat({
  label,
  value,
  tone = "text-ink",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-[0.58em] font-bold uppercase text-muted">{label}</p>
      <p className={`text-[0.95em] font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function PlotRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center gap-[0.8em] rounded-[1.2em] border border-line/70 bg-surface p-[0.85em]">
      <span className="flex h-[2.1em] w-[2.1em] flex-none items-center justify-center rounded-[0.7em] bg-primary/10 text-primary-deep">
        <ScreenIcon name="landmark" className="h-[1em] w-[1em]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.78em] font-bold">{name}</p>
        <p className="text-[0.66em] text-muted">{meta}</p>
      </div>
      <ScreenIcon name="chevron-right" className="h-[1em] w-[1em] flex-none text-muted" />
    </div>
  );
}

/* ---------------------------------------------------------- notifications -- */

function NotificationsScreen() {
  return (
    <div className={shell}>
      <StatusBar />
      <div className="flex items-center justify-between px-[1.6em] pb-[0.4em]">
        <TopBtn icon="chevron-left" />
        <div className="flex flex-col items-center gap-[0.35em]">
          <p className="text-[0.82em] font-bold">Notifications</p>
          <span className="rounded-full bg-primary/20 px-[0.7em] py-[0.15em] text-[0.6em] font-bold text-primary-strong">
            2 unread
          </span>
        </div>
        <TopBtn icon="refresh" accent />
      </div>

      <p className="px-[1.7em] pb-[0.5em] text-right text-[0.72em] font-bold text-primary-deep">
        Mark all as read
      </p>

      <div className="min-h-0 flex-1 space-y-[0.9em] overflow-hidden px-[1.7em]">
        <NotifCard
          icon="check-circle"
          iconBg="bg-mint text-primary-strong"
          title="Farm approved"
          body='"Nyagatare Plot A" is verified — you can register trees now.'
          time="2d ago"
          unread
        />
        <NotifCard
          icon="tree"
          iconBg="bg-mint text-primary-strong"
          title="3-month inspection due"
          body='Your Avocado on "Nyagatare Plot A" needs its health check.'
          time="5d ago"
          unread
        />
        <NotifCard
          icon="clock"
          iconBg="bg-[#fef3c7] text-[#d97706]"
          title="Farm under review"
          body='"Kayonza Ridge" was submitted for verification.'
          time="1w ago"
        />
      </div>
      <HomeIndicator />
    </div>
  );
}

function NotifCard({
  icon,
  iconBg,
  title,
  body,
  time,
  unread = false,
}: {
  icon: "check-circle" | "tree" | "clock";
  iconBg: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <div
      className={`flex gap-[0.9em] rounded-[1.5em] border p-[1em] ${
        unread ? "border-primary/40 bg-primary/[0.06]" : "border-line/60 bg-surface"
      }`}
    >
      <span
        className={`flex h-[2.4em] w-[2.4em] flex-none items-center justify-center rounded-[1em] ${iconBg}`}
      >
        <ScreenIcon name={icon} className="h-[1.25em] w-[1.25em]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-[0.5em]">
          <p className="truncate text-[0.85em] font-bold">{title}</p>
          {unread && (
            <span className="h-[0.5em] w-[0.5em] flex-none rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-[0.25em] line-clamp-2 text-[0.72em] leading-[1.45] text-muted">
          {body}
        </p>
        <p className="mt-[0.4em] text-[0.6em] font-bold uppercase tracking-[0.08em] text-muted/70">
          {time}
        </p>
      </div>
    </div>
  );
}
