import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function testAdminRoutes() {
  try {
    console.log('🧪 Testing Admin Routes\n');
    console.log('=' .repeat(50));

    // Note: Make sure you're logged in via the frontend first, then use that token
    // Or register a new user and set them as admin
    console.log('\n⚠️  Please provide admin credentials:');
    console.log('Option 1: Login via frontend and copy token from localStorage');
    console.log('Option 2: Register new user, then run migration to set as admin\n');
    
    // For testing, let's use a token you can get from the browser
    // After logging in, run: localStorage.getItem('token')
    const token = process.env.ADMIN_TOKEN || 'YOUR_TOKEN_HERE';
    
    if (token === 'YOUR_TOKEN_HERE') {
      console.log('❌ Please set ADMIN_TOKEN environment variable or update the script');
      console.log('\nSteps:');
      console.log('1. Login to the app via browser');
      console.log('2. Open browser console and run: localStorage.getItem("token")');
      console.log('3. Copy the token');
      console.log('4. Run: $env:ADMIN_TOKEN="your-token"; node test/testAdminRoutes.js');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test Dashboard Stats
    console.log('\n2️⃣  Testing /api/admin/stats...');
    const statsRes = await axios.get(`${API_URL}/admin/stats`, { headers });
    console.log('✓ Dashboard stats retrieved:');
    console.log('  - Total Users:', statsRes.data.stats.totalUsers);
    console.log('  - Total Jobs:', statsRes.data.stats.totalJobs);
    console.log('  - Total Resources:', statsRes.data.stats.totalResources);
    console.log('  - Total Courses:', statsRes.data.stats.totalCourses);
    console.log('  - Total Interviews:', statsRes.data.stats.totalInterviews);

    // 3. Test Get All Jobs
    console.log('\n3️⃣  Testing /api/admin/jobs...');
    const jobsRes = await axios.get(`${API_URL}/admin/jobs?limit=5`, { headers });
    console.log('✓ Jobs retrieved:', jobsRes.data.jobs.length, 'jobs');
    console.log('  Total jobs:', jobsRes.data.pagination.total);

    // 4. Test Get All Resources
    console.log('\n4️⃣  Testing /api/admin/resources...');
    const resourcesRes = await axios.get(`${API_URL}/admin/resources?limit=5`, { headers });
    console.log('✓ Resources retrieved:', resourcesRes.data.resources.length, 'resources');
    console.log('  Total resources:', resourcesRes.data.pagination.total);

    // 5. Test Get All Users
    console.log('\n5️⃣  Testing /api/admin/users...');
    const usersRes = await axios.get(`${API_URL}/admin/users?limit=5`, { headers });
    console.log('✓ Users retrieved:', usersRes.data.users.length, 'users');
    console.log('  Total users:', usersRes.data.pagination.total);

    // 6. Test Analytics - SDG Impact
    console.log('\n6️⃣  Testing /api/analytics/sdg-impact...');
    const analyticsRes = await axios.get(`${API_URL}/analytics/sdg-impact`, { headers });
    console.log('✓ SDG Impact analytics retrieved:');
    console.log('  - Users Analyzed:', analyticsRes.data.analytics.overview.usersAnalyzed);
    console.log('  - Analysis Rate:', analyticsRes.data.analytics.overview.analysisRate + '%');
    console.log('  - Top Skill Gaps:', analyticsRes.data.analytics.skillGaps?.length || 0);

    // 7. Test User Growth Stats
    console.log('\n7️⃣  Testing /api/analytics/user-growth...');
    const growthRes = await axios.get(`${API_URL}/analytics/user-growth?period=7`, { headers });
    console.log('✓ User growth data retrieved:', growthRes.data.growth.length, 'days');

    // 8. Test Job Trends
    console.log('\n8️⃣  Testing /api/analytics/job-trends...');
    const trendsRes = await axios.get(`${API_URL}/analytics/job-trends`, { headers });
    console.log('✓ Job trends retrieved');
    console.log('  - Job types:', trendsRes.data.trends.byType.length);
    console.log('  - Experience levels:', trendsRes.data.trends.byExperience.length);

    // 9. Test Interview Performance
    console.log('\n9️⃣  Testing /api/analytics/interview-performance...');
    const perfRes = await axios.get(`${API_URL}/analytics/interview-performance`, { headers });
    console.log('✓ Interview performance retrieved:');
    console.log('  - Total Interviews:', perfRes.data.performance.totalInterviews);
    console.log('  - Average Score:', perfRes.data.performance.averageScore);

    console.log('\n' + '='.repeat(50));
    console.log('✅ All admin routes tested successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      if (error.response.status === 403) {
        console.error('\n⚠️  User does not have admin privileges.');
        console.error('Run: node migrations/addRoleColumn.js');
        console.error('Or manually set role to "admin" in the database.');
      }
    } else {
      console.error(error.message);
    }
  }
}

testAdminRoutes();
