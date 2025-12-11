const supabase = require('./index');

// Create a chat message
async function createChatMessage(messageData) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([messageData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get all messages in a conversation
async function getMessagesByConversation(conversationId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Get all messages for a user, across all conversations
async function getUserConversations(userId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Mark all unread messages in a conversation as read
async function markMessagesRead(conversationId, userId) {
  const { data: unreadMessages, error } = await supabase
    .from('chat_messages')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .eq('status', 'unread');

  if (error) throw error;
  if (!unreadMessages.length) return;

  const ids = unreadMessages.map(msg => msg.id);

  const { error: updateError } = await supabase
    .from('chat_messages')
    .update({ status: 'read' })
    .in('id', ids);

  if (updateError) throw updateError;
}

// Update message status (e.g., mark as read)
async function updateMessageStatus(id, status) {
  const { data, error } = await supabase
    .from('chat_messages')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete a message
async function deleteMessage(id) {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createChatMessage,
  getMessagesByConversation,
  getUserConversations,
  markMessagesRead,
  updateMessageStatus,
  deleteMessage,
};