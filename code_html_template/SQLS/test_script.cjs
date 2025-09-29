const fs = require('fs');
const path = require('path');

console.log('🧪 Test script starting...');

const INPUT_FILE = path.join(__dirname, 'dump-giventa_event_management-202506240024_pre_tenant_id_with_insert_data.sql');
const OUTPUT_FILE = path.join(__dirname, 'test_output.sql');

console.log('📁 Input file:', INPUT_FILE);
console.log('📁 Output file:', OUTPUT_FILE);

// Check if input file exists
if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ Input file does not exist:', INPUT_FILE);
  process.exit(1);
}

console.log('✅ Input file exists');

try {
  const sql = fs.readFileSync(INPUT_FILE, 'utf8');
  console.log('✅ File read successfully, length:', sql.length);

  const lines = sql.split(/\r?\n/);
  console.log('✅ Lines split successfully, count:', lines.length);

  // Find first INSERT statement
  let insertCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^INSERT INTO public\./)) {
      insertCount++;
      if (insertCount === 1) {
        console.log('📝 First INSERT found at line', i + 1, ':', lines[i].substring(0, 100) + '...');
      }
    }
  }

  console.log('📊 Total INSERT statements found:', insertCount);

  // Write test output
  fs.writeFileSync(OUTPUT_FILE, 'Test output file created successfully!', 'utf8');
  console.log('✅ Test output file created');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('🎉 Test completed successfully!');














