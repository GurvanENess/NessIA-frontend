import { PostsDbTest } from './database/posts.test';
import { ConversationsDbTest } from './database/conversations.test';
import { AuthDbTest } from './database/auth.test';

// Runner principal pour exécuter tous les tests
export class TestRunner {
  private postsTest = new PostsDbTest();
  private conversationsTest = new ConversationsDbTest();
  private authTest = new AuthDbTest();

  async runAllTests() {
    console.log('🧪 Starting Supabase Database Tests...');
    console.log('=====================================');
    
    const startTime = Date.now();
    let passedTests = 0;
    let failedTests = 0;

    try {
      // Tests d'authentification
      console.log('\n🔐 Running Authentication Tests...');
      await this.authTest.runAllTests();
      passedTests++;
    } catch (error) {
      console.error('Authentication tests failed:', error);
      failedTests++;
    }

    try {
      // Tests des posts
      console.log('\n📝 Running Posts Database Tests...');
      await this.postsTest.runAllTests();
      passedTests++;
    } catch (error) {
      console.error('Posts tests failed:', error);
      failedTests++;
    }

    try {
      // Tests des conversations
      console.log('\n💬 Running Conversations Database Tests...');
      await this.conversationsTest.runAllTests();
      passedTests++;
    } catch (error) {
      console.error('Conversations tests failed:', error);
      failedTests++;
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('\n=====================================');
    console.log('🏁 Test Results Summary:');
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️ Duration: ${duration}s`);
    
    if (failedTests === 0) {
      console.log('🎉 All tests passed successfully!');
    } else {
      console.log('💥 Some tests failed. Check the logs above for details.');
    }
  }

  async runPostsTests() {
    console.log('📝 Running Posts Tests Only...');
    await this.postsTest.runAllTests();
  }

  async runConversationsTests() {
    console.log('💬 Running Conversations Tests Only...');
    await this.conversationsTest.runAllTests();
  }

  async runAuthTests() {
    console.log('🔐 Running Auth Tests Only...');
    await this.authTest.runAllTests();
  }
}

// Fonction utilitaire pour exécuter les tests depuis la console
export const runTests = {
  all: () => new TestRunner().runAllTests(),
  posts: () => new TestRunner().runPostsTests(),
  conversations: () => new TestRunner().runConversationsTests(),
  auth: () => new TestRunner().runAuthTests()
};

// Exposer globalement pour les tests en développement
if (typeof window !== 'undefined') {
  (window as any).runTests = runTests;
}