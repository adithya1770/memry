import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vhbwfstbukfajgeqcvxq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYndmc3RidWtmYWpnZXFjdnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODgzNjksImV4cCI6MjA3MTk2NDM2OX0.RO4qHuAzkIExMCKix_z8N8FldSWYNfGIHcwBCvDtQFo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
