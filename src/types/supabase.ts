export interface Archive {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  qr_code: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ArchiveRecipient {
  id: string;
  archive_id: string;
  email: string;
  created_at: string;
}