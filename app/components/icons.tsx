/**
 * Authored icon set. One grid (24), one stroke weight (1.75), square caps to
 * match the hard-edged world — no rounded joins anywhere else on the site.
 * Unicode glyphs and emoji are not icons; nothing here falls back to one.
 */

type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

const base = (className?: string) => ({
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  className: className ?? "w-4 h-4",
});

export const ArrowLeft = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowRight = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Close = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Plus = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Check = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const Play = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M7 4.5v15l13-7.5-13-7.5z" />
  </svg>
);

export const Star = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 10l6.1-.9L12 3.5z" />
  </svg>
);

export const Trash = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </svg>
);

export const Pencil = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
  </svg>
);

export const Power = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M12 3v9M6.5 6.5a8 8 0 1011 0" />
  </svg>
);

export const Image = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6" />
  </svg>
);

/** WhatsApp is a brand mark, so it ships filled and exact rather than restyled. */
export const Eye = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const EyeOff = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M10.6 6.2A9.9 9.9 0 0 1 12 5c7 0 11 7 11 7a18.6 18.6 0 0 1-3 3.8M6.3 7.3A18.9 18.9 0 0 0 1 12s4 7 11 7a9.9 9.9 0 0 0 4.5-1.1" />
    <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    <path d="M2 2l20 20" />
  </svg>
);

export const Cart = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M3 4h2.5l2.2 10.5h9.6L19 7H6.2" />
    <path d="M9 19.5h.01M17 19.5h.01" strokeWidth={2.5} />
  </svg>
);

export const Minus = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M5 12h14" />
  </svg>
);

export const Phone = ({ className }: IconProps) => (
  <svg {...base(className)} {...stroke}>
    <path d="M7 3h3l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L21 14v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const WhatsApp = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className ?? "w-5 h-5"}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
  </svg>
);
