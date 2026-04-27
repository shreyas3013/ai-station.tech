import { supabase } from '@/lib/supabase';

export async function shareChat(chatId: string): Promise<string> {
  const { data: existing } = await supabase
    .from('chats').select('share_token').eq('id', chatId).maybeSingle();

  let token = existing?.share_token;
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, '');
  }
  const { error } = await supabase
    .from('chats')
    .update({ is_shared: true, share_token: token })
    .eq('id', chatId);
  if (error) throw error;
  return `${window.location.origin}/share/${token}`;
}