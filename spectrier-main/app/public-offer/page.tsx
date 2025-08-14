"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import CartItem from "@/components/cart-item";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { sendInvoiceToBot, sendInvoiceToSupport } from "@/actions";
// or if inside lib
// import { sendInvoiceToBot, sendInvoiceToSupport } from "@/lib/actions";
import { NewUser } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [comment, setComment] = useState("");
  const [address, setAddress] = useState("");

  const totalSum = cart
    .map((p) => p.price * (p.quantity as number))
    .reduce((next, prev) => next + prev, 0);

  useEffect(() => {
    if (window == undefined) return;
    Telegram.WebApp.BackButton.show();
    Telegram.WebApp.BackButton.onClick(() => router.back());

    Telegram.WebApp.MainButton.hide();
  }, [router]);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) router.back();
  };

  const submitInvoiceToSupport = () => {
    const user: NewUser = {
      name: Telegram.WebApp.initDataUnsafe.user?.first_name || "",
      telegramId: Telegram.WebApp.initDataUnsafe.user?.id.toString() || "",
      username: Telegram.WebApp.initDataUnsafe.user?.username || "",
    };

    const sanitizedComment = comment.replaceAll(".", " ");
    const sanitizedAddress = address.replaceAll(".", " ");

    startTransition(() =>
      sendInvoiceToSupport({
        cart,
        totalSum,
        comment: sanitizedComment,
        address: sanitizedAddress,
        user,
      }).then(() =>
        Telegram.WebApp.showAlert(
          "Your order has been submitted. Please wait for a consultant.",
          () => Telegram.WebApp.close()
        )
      )
    );
  };

  const submitInvoiceToBot = () => {
    const user: NewUser = {
      name: Telegram.WebApp.initDataUnsafe.user?.first_name || "",
      telegramId: Telegram.WebApp.initDataUnsafe.user?.id.toString() || "",
      username: Telegram.WebApp.initDataUnsafe.user?.username || "",
    };

    const sanitizedComment = comment.replaceAll(".", " ");
    const sanitizedAddress = address.replaceAll(".", " ");

    startTransition(() =>
      sendInvoiceToBot({
        cart,
        totalSum,
        comment: sanitizedComment,
        address: sanitizedAddress,
        user,
      }).then(() =>
        Telegram.WebApp.showAlert("Your order has been submitted.", () =>
          Telegram.WebApp.close()
        )
      )
    );
  };

  return (
    <Dialog open onOpenChange={handleOnOpenChange}>
      <DialogContent className="sm:max-w-[425px] mt-10 mx-10">
        <div className="grid gap-2 py-4">
          <p className="text-lg font-bold">YOUR ORDER</p>
          {cart.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <Separator />
          <div className="p-2 h-10 rounded-md flex items-center justify-between">
            <p className="text-lg">Total:</p>
            <p>{totalSum} ₸</p>
          </div>
          <Separator />
          <div className="space-y-2 pt-4">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(value) => setComment(value.currentTarget.value)}
            />
            <p className="text-sm text-muted-foreground">
              Any wishes, notes, or questions.
            </p>
            <Input
              placeholder="Address"
              value={address}
              onChange={(value) => setAddress(value.currentTarget.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter your delivery address...
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h2>Select a payment method:</h2>
          <div className="flex space-x-2 w-full justify-center">
            <Button onClick={submitInvoiceToSupport} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Via Consultant"
              )}
            </Button>
            {/* <Button onClick={submitInvoiceToBot} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Via Telegram Bot"
              )}
            </Button> */}
          </div>
          <p className="text-sm text-muted-foreground">
            Via Consultant: our staff will contact you for payment.
          </p>
          {/* <p className="text-sm text-muted-foreground">
            Via Telegram Bot: the bot will send you a payment request.
          </p> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
