import { ORG } from '@/lib/config';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={light ? 'logo light' : 'logo'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ORG.logo} alt="" width={36} height={36} />
      <b>{ORG.short}</b>
    </span>
  );
}
