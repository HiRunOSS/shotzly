"use client";

import {useMemo, useState} from "react";
import {
  FaCheck,
  FaCoffee,
  FaCopy,
  FaHeart,
  FaMobileAlt,
  FaPaypal,
} from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Image from "next/image";

const BUY_ME_COFFEE_URL = "https://buymeacoffee.com/hiarun01";
const PAYPAL_URL = "https://paypal.me/hiarun01";
const UPI_ID = "hey.arunkumar@axl";

interface SupportDialogProps {
  children?: React.ReactNode;
}

export default function SupportDialog({children}: SupportDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const qrSrc = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(
        `upi://pay?pa=${UPI_ID}&pn=Shotzly`,
      )}`,
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-50 gap-2 rounded-full bg-red-500 px-4 text-white shadow-lg shadow-red-500/40 hover:bg-red-600 dark:shadow-red-500/20"
          >
            <FaHeart />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto border-gray-200 bg-white p-4 text-gray-900 dark:border-white/10 dark:bg-[#111010] dark:text-gray-100 sm:max-w-3xl sm:p-6">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Support Shotzly
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Keep Shotzly free for everyone. Choose any option below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm dark:border-amber-500/20 dark:bg-[#111010]/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
                <FaCoffee />
              </span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Buy Me a Coffee
                </p>
                <p className="text-sm text-amber-800/80 dark:text-amber-200/80">
                  Quick one-time boost.
                </p>
              </div>
            </div>
            <Button
              className="mt-3 w-full bg-amber-600 hover:bg-amber-700"
              asChild
            >
              <a href={BUY_ME_COFFEE_URL} target="_blank" rel="noreferrer">
                Go to Buy Me a Coffee
              </a>
            </Button>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 shadow-sm dark:border-blue-500/20 dark:bg-[#111010]/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FaPaypal />
              </span>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">
                  PayPal
                </p>
                <p className="text-sm text-blue-800/80 dark:text-blue-200/80">
                  Global card-friendly checkout.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full border-blue-200 text-blue-900 hover:bg-blue-100 dark:border-blue-400/40 dark:text-blue-200 dark:hover:bg-blue-500/20"
              asChild
            >
              <a href={PAYPAL_URL} target="_blank" rel="noreferrer">
                Open PayPal
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-white/10 dark:bg-[#111010]/60 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-[#111010]/20 dark:text-emerald-200">
                <FaMobileAlt />
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  UPI Payment
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Scan or use UPI ID.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="w-full gap-2 text-sm text-gray-700 dark:text-gray-200 sm:w-auto"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <FaCheck className="text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <FaCopy /> Copy UPI ID
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[240px,1fr] sm:items-center">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-[#111010]">
              <Image
                src={qrSrc}
                alt="UPI QR"
                width={192}
                height={192}
                className="mx-auto h-40 w-40 object-contain sm:h-48 sm:w-48"
                unoptimized
              />
            </div>
            <div className="space-y-2 rounded-lg bg-white/70 p-4 text-center text-sm text-gray-700 dark:bg-[#111010]/80 dark:text-gray-200 sm:text-left">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {UPI_ID}
              </p>
              <p>Scan with any UPI app or paste the ID above.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
