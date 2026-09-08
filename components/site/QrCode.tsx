import QRCode from "qrcode";

/**
 * Server component: renders a scannable QR code for `value` as inline SVG,
 * generated at build time. `value` is the APK URL from
 * NEXT_PUBLIC_ANDROID_APK_URL, so the code regenerates whenever the release
 * URL changes.
 */
export async function QrCode({
  value,
  className = "",
  label = "QR code — scan with an Android camera to download the app",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <div
      role="img"
      aria-label={label}
      className={className}
      // SVG is produced by the qrcode library from our own URL — no user input.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
