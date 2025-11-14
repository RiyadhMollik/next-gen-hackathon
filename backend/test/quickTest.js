import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Admin & Analytics Routes Protection\n');
console.log('=' .repeat(60));

async function testRouteProtection() {
  const routes = [
    { method: 'GET', path: '/admin/stats', name: 'Admin Dashboard Stats' },
    { method: 'GET', path: '/admin/jobs', name: 'Admin Jobs List' },
    { method: 'GET', path: '/admin/resources', name: 'Admin Resources List' },
    { method: 'GET', path: '/admin/users', name: 'Admin Users List' },
    { method: 'GET', path: '/analytics/sdg-impact', name: 'SDG Impact Analytics' },
    { method: 'GET', path: '/analytics/user-growth', name: 'User Growth Stats' },
    { method: 'GET', path: '/analytics/job-trends', name: 'Job Trends' },
    { method: 'GET', path: '/analytics/interview-performance', name: 'Interview Performance' }
  ];

  console.log('\n📋 Testing route protection (should return 401 Unauthorized):\n');

  for (const route of routes) {
    try {
      await axios[route.method.toLowerCase()](`${API_URL}${route.path}`);
      console.log(`❌ ${route.name}: NOT PROTECTED (should be protected!)`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`✓ ${route.name}: Protected correctly (401)`);
      } else if (error.response?.status === 403) {
        console.log(`✓ ${route.name}: Protected correctly (403)`);
      } else {
        console.log(`⚠️  ${route.name}: Unexpected status ${error.response?.status}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Route protection test complete!\n');
  console.log('📝 Next steps:');
  console.log('1. Start the frontend: cd frontend && npm run dev');
  console.log('2. Login with your account');
  console.log('3. Your user (ID: 1) is now an admin');
  console.log('4. Navigate to /admin or /analytics to test the pages');
  console.log('5. Check browser console for any errors\n');
}

testRouteProtection().catch(err => {
  console.error('\n❌ Error:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('\n⚠️  Backend server is not running!');
    console.error('Start it with: cd backend && npm run dev\n');
  }
});
