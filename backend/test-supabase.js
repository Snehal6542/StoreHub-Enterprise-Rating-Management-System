const supabase = require('./src/config/database');

async function testSupabase() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection works');
    console.log('Users table data:', data);
  } catch (error) {
    console.error('❌ Supabase error:', error.message);
  }
}

testSupabase();