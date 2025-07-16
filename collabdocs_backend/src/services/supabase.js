require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

/**
 * Initializes the Supabase client using environment variables for secure configuration.
 * @returns {SupabaseClient} An instance of the Supabase client.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key missing in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
