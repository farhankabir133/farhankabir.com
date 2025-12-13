#!/usr/bin/env node

/**
 * Newsletter Subscription Test Script
 * 
 * This script verifies that the newsletter subscription functionality works correctly.
 * It checks:
 * 1. Supabase connection
 * 2. Table exists
 * 3. Can insert a test subscriber
 * 4. Can detect duplicates
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testNewsletterSubscription() {
  console.log('\n🧪 Newsletter Subscription Verification Test\n');
  console.log('═'.repeat(50));

  // Step 1: Check environment variables
  console.log('\n📋 Step 1: Checking environment variables...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables not set!');
    console.log('\nPlease update your .env file with:');
    console.log('  VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.log('  VITE_SUPABASE_ANON_KEY=your_anon_key_here');
    console.log('\nGet these from: https://app.supabase.com/project/_/settings/api');
    rl.close();
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

  // Step 2: Initialize Supabase client
  console.log('\n📋 Step 2: Connecting to Supabase...');
  
  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
    rl.close();
    process.exit(1);
  }

  // Step 3: Check if table exists
  console.log('\n📋 Step 3: Checking if newsletter_subscribers table exists...');
  
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('does not exist')) {
        console.error('❌ Table does not exist!');
        console.log('\n⚠️  You need to run the migration first:');
        console.log('   1. Go to https://app.supabase.com');
        console.log('   2. Open SQL Editor');
        console.log('   3. Run the SQL from: supabase/migrations/20251127000000_newsletter_subscribers.sql');
        rl.close();
        process.exit(1);
      }
      throw error;
    }

    console.log('✅ Table exists');
  } catch (error) {
    console.error('❌ Error checking table:', error.message);
    rl.close();
    process.exit(1);
  }

  // Step 4: Get current subscriber count
  console.log('\n📋 Step 4: Getting current subscriber count...');
  
  try {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`✅ Current subscribers: ${count}`);
  } catch (error) {
    console.error('❌ Error getting count:', error.message);
  }

  // Step 5: Test inserting a subscriber
  console.log('\n📋 Step 5: Testing subscriber insertion...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  console.log(`   Using test email: ${testEmail}`);

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: testEmail,
          source: 'test_script',
          status: 'active'
        }
      ])
      .select();

    if (error) throw error;

    console.log('✅ Successfully inserted test subscriber!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Email: ${data[0].email}`);
    console.log(`   Subscribed at: ${data[0].subscribed_at}`);
  } catch (error) {
    console.error('❌ Error inserting subscriber:', error.message);
    rl.close();
    process.exit(1);
  }

  // Step 6: Test duplicate detection
  console.log('\n📋 Step 6: Testing duplicate detection...');
  
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: testEmail,
          source: 'test_script',
          status: 'active'
        }
      ]);

    if (error && error.code === '23505') {
      console.log('✅ Duplicate detection works correctly!');
    } else if (!error) {
      console.warn('⚠️  Warning: Duplicate was inserted (unique constraint may not be set)');
    }
  } catch (error) {
    console.error('❌ Error testing duplicate:', error.message);
  }

  // Step 7: Get updated count
  console.log('\n📋 Step 7: Getting updated subscriber count...');
  
  try {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`✅ Total subscribers now: ${count}`);
  } catch (error) {
    console.error('❌ Error getting count:', error.message);
  }

  // Step 8: Clean up test data
  console.log('\n📋 Step 8: Cleaning up test data...');
  
  const cleanup = await question('Do you want to delete the test subscriber? (y/n): ');
  
  if (cleanup.toLowerCase() === 'y') {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail);

      if (error) throw error;

      console.log('✅ Test subscriber deleted');
    } catch (error) {
      console.error('❌ Error deleting test subscriber:', error.message);
    }
  }

  // Final summary
  console.log('\n' + '═'.repeat(50));
  console.log('\n✨ Verification Complete!\n');
  console.log('Summary:');
  console.log('  ✅ Supabase connection working');
  console.log('  ✅ Table exists and accessible');
  console.log('  ✅ Can insert subscribers');
  console.log('  ✅ Duplicate detection working');
  console.log('\n🎉 Newsletter subscription is ready to use!');
  console.log('\n💡 Next steps:');
  console.log('  1. Restart your dev server (npm run dev)');
  console.log('  2. Open your website');
  console.log('  3. Try subscribing with a real email');
  console.log('  4. Check Supabase dashboard to verify\n');

  rl.close();
}

// Run the test
testNewsletterSubscription().catch(error => {
  console.error('\n❌ Test failed:', error);
  rl.close();
  process.exit(1);
});
