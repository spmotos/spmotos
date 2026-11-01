"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef } from "react";
import { MotoDetailView } from "@/components/MotoDetailView";
import { PublicMoto } from "@/lib/clickgarage/types";
import { WhatsAppContactLink } from "@/lib/store-whatsapp";
import { copy } from "@/lib/copy";

interface MotoDetailModalProps {
  moto: PublicMoto;
  whatsappLinks: WhatsAppContactLink[];
}

const CloseIcon: React.FC = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/** O modal só existe via rota interceptada (navegação interna), então sempre há histórico para voltar. */
const useCloseMotoModal = (): (() => void) => {
  const router = useRouter();
  return useCallback((): void => router.back(), [router]);
};

interface MotoDetailModalFrameProps {
  title: string;
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
  keyboardRootRef: React.RefObject<HTMLDivElement | null>;
}

const MotoDetailModalFrame: React.FC<MotoDetailModalFrameProps> = ({
  title,
  titleId,
  onClose,
  children,
  keyboardRootRef,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        role="presentation"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={keyboardRootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-2xl border border-stone bg-page shadow-xl sm:max-h-[90dvh] sm:max-w-5xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stone px-4 py-3 sm:px-6">
          <p id={titleId} className="line-clamp-1 text-sm font-semibold text-foreground">
            {title}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={copy.detail.close}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-stone bg-surface text-foreground transition hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const MotoDetailModal: React.FC<MotoDetailModalProps> = ({ moto, whatsappLinks }) => {
  const onClose = useCloseMotoModal();
  const titleId = useId();
  const keyboardRootRef = useRef<HTMLDivElement>(null);

  return (
    <MotoDetailModalFrame
      title={moto.titulo}
      titleId={titleId}
      onClose={onClose}
      keyboardRootRef={keyboardRootRef}
    >
      <MotoDetailView
        moto={moto}
        whatsappLinks={whatsappLinks}
        titleId={`${titleId}-heading`}
        galleryKeyboardRootRef={keyboardRootRef}
      />
    </MotoDetailModalFrame>
  );
};

export const MotoDetailMissingModal: React.FC = () => {
  const onClose = useCloseMotoModal();
  const titleId = useId();
  const keyboardRootRef = useRef<HTMLDivElement>(null);

  return (
    <MotoDetailModalFrame
      title={copy.detail.modalNotFound}
      titleId={titleId}
      onClose={onClose}
      keyboardRootRef={keyboardRootRef}
    >
      <p className="text-pretty text-moss">
        {copy.detail.modalNotFound}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-stone bg-muted px-5 text-sm font-semibold text-foreground hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {copy.detail.close}
      </button>
    </MotoDetailModalFrame>
  );
};
