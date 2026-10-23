import { supabase } from './supabaseClient';
export type PaymentStatus = 'awaiting_receipt'|'submitted'|'confirmed'|'rejected'|'cancelled';
export type PaymentRequest = {
  id:string;kind:'article'|'thesis';submission_id:string;author_id:string;title:string;field:string|null;
  amount:number;currency:string;card_number:string;status:PaymentStatus;
  publication_year:number;volume:number;issue:number;receipt_path:string|null;review_note:string|null;
  created_at:string;updated_at:string;deleted_at:string|null;
};
export const paymentLabels:Record<PaymentStatus,string> = {awaiting_receipt:'To‘lov kutilmoqda',submitted:'Chek tekshirilmoqda',confirmed:'To‘lov tasdiqlandi',rejected:'Chek rad etildi',cancelled:'Bekor qilindi'};
export const receiptTypes:Record<string,string> = {'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
export function validateReceipt(file:{type:string;size:number}) {
  if(!receiptTypes[file.type])throw new Error('Chek PDF, JPG, PNG yoki WEBP formatida bo‘lishi kerak.');
  if(file.size<=0 || file.size>10*1024*1024)throw new Error('Chek hajmi 0 dan katta va 10 MB dan oshmagan bo‘lishi kerak.');
}
export async function submitReceipt(payment:PaymentRequest,userId:string,file:File) {
  validateReceipt(file);
  const path=`${userId}/${payment.id}/${crypto.randomUUID()}.${receiptTypes[file.type]}`;
  const {error:uploadError} = await supabase.storage.from('payment-receipts').upload(path,file,{upsert:false,contentType:file.type});
  if(uploadError)throw new Error(uploadError.message);
  const {error} = await supabase.rpc('journal_submit_receipt',{p_payment:payment.id,p_path:path});
  if(error){await supabase.storage.from('payment-receipts').remove([path]);throw new Error(error.message);}
}
export async function signedReceipt(path:string) {
  const {data,error}=await supabase.storage.from('payment-receipts').createSignedUrl(path,120);
  if(error || !data?.signedUrl)throw new Error(error?.message || 'Chekni ochib bo‘lmadi.');
  return data.signedUrl;
}
