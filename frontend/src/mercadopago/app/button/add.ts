// app/actions/add.ts
"use server";

import { redirect } from "next/navigation";
import api from "../api"; // ruta a tu archivo api.ts

export default async function add() {
  const url = await api.createPayment();
  redirect(url);
}
