import { NewUser } from "@/lib/db/schema";
import { CartItem } from "@/types/cart";

export async function sendInvoiceToBot(data: {
  cart: CartItem[];
  totalSum: number;
  comment: string;
  address: string;
  user: NewUser;
}) {
  // implement bot invoice sending
}

export async function sendInvoiceToSupport(data: {
  cart: CartItem[];
  totalSum: number;
  comment: string;
  address: string;
  user: NewUser;
}) {
  // implement support invoice sending
}
