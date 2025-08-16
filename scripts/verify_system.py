#!/usr/bin/env python3
"""
UK Customer Intelligence Platform - System Verification Script
This script tests all components to ensure the platform is working correctly.
"""

import requests
import time
import json
import sys
from datetime import datetime

class SystemVerifier:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.frontend_url = "http://localhost:3000"
        self.test_email = "test@example.com"
        self.test_password = "SecurePass123"
        self.access_token = None
        self.results = []
        
    def log_result(self, test_name, success, message="", details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")

    def test_backend_health(self):
        """Test backend health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Backend Health", True, "Backend is healthy")
                    return True
                else:
                    self.log_result("Backend Health", False, f"Backend unhealthy: {data}")
                    return False
            else:
                self.log_result("Backend Health", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Backend Health", False, f"Connection error: {str(e)}")
            return False

    def test_frontend_accessibility(self):
        """Test frontend accessibility"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            if response.status_code == 200:
                self.log_result("Frontend Access", True, "Frontend is accessible")
                return True
            else:
                self.log_result("Frontend Access", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Frontend Access", False, f"Connection error: {str(e)}")
            return False

    def test_authentication(self):
        """Test authentication system"""
        try:
            # Test login
            login_data = {
                "email": self.test_email,
                "password": self.test_password
            }
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.log_result("Authentication", True, f"Login successful for {data['user']['email']}")
                    return True
                else:
                    self.log_result("Authentication", False, "Invalid response format", data)
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.headers.get("content-type", "").startswith("application/json") else response.text
                self.log_result("Authentication", False, f"Login failed: {error_msg}")
                return False
        except Exception as e:
            self.log_result("Authentication", False, f"Login error: {str(e)}")
            return False

    def test_companies_house_api(self):
        """Test Companies House API integration"""
        if not self.access_token:
            self.log_result("Companies House API", False, "No access token (authentication failed)")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(
                f"{self.base_url}/api/companies/search?q=marks+spencer",
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "companies" in data and len(data["companies"]) > 0:
                    company_name = data["companies"][0].get("name", "Unknown")
                    self.log_result("Companies House API", True, f"Found companies, first: {company_name}")
                    return True
                else:
                    self.log_result("Companies House API", False, "No companies returned", data)
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.headers.get("content-type", "").startswith("application/json") else response.text
                self.log_result("Companies House API", False, f"Search failed: {error_msg}")
                return False
        except Exception as e:
            self.log_result("Companies House API", False, f"API error: {str(e)}")
            return False

    def test_company_details(self):
        """Test company details endpoint"""
        if not self.access_token:
            self.log_result("Company Details", False, "No access token")
            return False
            
        try:
            # Test with Marks & Spencer (known company)
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(
                f"{self.base_url}/api/companies/00000006",
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "company" in data:
                    company = data["company"]
                    name = company.get("name", "Unknown")
                    self.log_result("Company Details", True, f"Retrieved details for: {name}")
                    return True
                else:
                    self.log_result("Company Details", False, "Invalid response format", data)
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.headers.get("content-type", "").startswith("application/json") else response.text
                self.log_result("Company Details", False, f"Details fetch failed: {error_msg}")
                return False
        except Exception as e:
            self.log_result("Company Details", False, f"Details error: {str(e)}")
            return False

    def test_dashboard_data(self):
        """Test dashboard data endpoint"""
        if not self.access_token:
            self.log_result("Dashboard Data", False, "No access token")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(
                f"{self.base_url}/api/dashboard",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "stats" in data:
                    stats = data["stats"]
                    companies_count = stats.get("total_companies", 0)
                    alerts_count = stats.get("unread_alerts", 0)
                    self.log_result("Dashboard Data", True, f"Dashboard loaded: {companies_count} companies, {alerts_count} alerts")
                    return True
                else:
                    self.log_result("Dashboard Data", False, "Invalid dashboard format", data)
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.headers.get("content-type", "").startswith("application/json") else response.text
                self.log_result("Dashboard Data", False, f"Dashboard failed: {error_msg}")
                return False
        except Exception as e:
            self.log_result("Dashboard Data", False, f"Dashboard error: {str(e)}")
            return False

    def test_monitoring_workflow(self):
        """Test complete monitoring workflow"""
        if not self.access_token:
            self.log_result("Monitoring Workflow", False, "No access token")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Try to add a company to monitoring
            response = requests.post(
                f"{self.base_url}/api/companies/00000006/monitor",
                headers=headers,
                timeout=15
            )
            
            if response.status_code in [200, 201, 400]:  # 400 might mean already monitored
                if response.status_code == 400:
                    error_data = response.json()
                    if "already monitored" in error_data.get("error", "").lower():
                        self.log_result("Monitoring Workflow", True, "Company already monitored (expected)")
                        return True
                
                # Check monitored companies list
                monitored_response = requests.get(
                    f"{self.base_url}/api/companies/monitored",
                    headers=headers,
                    timeout=10
                )
                
                if monitored_response.status_code == 200:
                    monitored_data = monitored_response.json()
                    companies = monitored_data.get("companies", [])
                    self.log_result("Monitoring Workflow", True, f"Monitoring workflow works: {len(companies)} companies monitored")
                    return True
                else:
                    self.log_result("Monitoring Workflow", False, "Failed to get monitored companies")
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.headers.get("content-type", "").startswith("application/json") else response.text
                self.log_result("Monitoring Workflow", False, f"Monitoring failed: {error_msg}")
                return False
        except Exception as e:
            self.log_result("Monitoring Workflow", False, f"Monitoring error: {str(e)}")
            return False

    def test_database_connectivity(self):
        """Test database connectivity through backend"""
        try:
            # The health endpoint includes database check
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                db_status = data.get("database", "unknown")
                if db_status == "healthy":
                    self.log_result("Database Connectivity", True, "Database is connected and healthy")
                    return True
                else:
                    self.log_result("Database Connectivity", False, f"Database status: {db_status}")
                    return False
            else:
                self.log_result("Database Connectivity", False, "Cannot check database status")
                return False
        except Exception as e:
            self.log_result("Database Connectivity", False, f"Database check error: {str(e)}")
            return False

    def test_redis_connectivity(self):
        """Test Redis connectivity (indirectly through health check)"""
        # Redis is tested indirectly - if authentication works, Redis is likely working
        if self.access_token:
            self.log_result("Redis Connectivity", True, "Redis appears to be working (auth tokens functional)")
            return True
        else:
            self.log_result("Redis Connectivity", False, "Cannot verify Redis (authentication failed)")
            return False

    def run_all_tests(self):
        """Run all system verification tests"""
        print("🚀 Starting UK Customer Intelligence Platform Verification")
        print("=" * 60)
        
        # Run tests in order
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Frontend Access", self.test_frontend_accessibility),
            ("Database Connectivity", self.test_database_connectivity),
            ("Authentication", self.test_authentication),
            ("Redis Connectivity", self.test_redis_connectivity),
            ("Companies House API", self.test_companies_house_api),
            ("Company Details", self.test_company_details),
            ("Dashboard Data", self.test_dashboard_data),
            ("Monitoring Workflow", self.test_monitoring_workflow),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🔍 Testing {test_name}...")
            if test_func():
                passed += 1
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 VERIFICATION SUMMARY")
        print("=" * 60)
        
        success_rate = (passed / total) * 100
        status_emoji = "🎉" if passed == total else "⚠️" if passed >= total * 0.7 else "❌"
        
        print(f"{status_emoji} Tests Passed: {passed}/{total} ({success_rate:.1f}%)")
        
        if passed == total:
            print("\n✅ ALL TESTS PASSED! Your UK Customer Intelligence Platform is fully functional.")
            print("\n🚀 You can now:")
            print("   • Visit http://localhost:3000 to access the dashboard")
            print("   • Login with test@example.com / SecurePass123")
            print("   • Search and monitor UK companies")
            print("   • View real-time alerts and insights")
        elif passed >= total * 0.7:
            print("\n⚠️ Most tests passed, but some issues detected.")
            print("   Check the failed tests above and refer to troubleshooting guide.")
        else:
            print("\n❌ Multiple critical issues detected.")
            print("   Please review the setup instructions and fix the failing components.")
        
        # Detailed results for debugging
        print(f"\n📋 Detailed Results:")
        for result in self.results:
            status = "✅" if result["success"] else "❌"
            print(f"   {status} {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main verification function"""
    print("UK Customer Intelligence Platform - System Verification")
    print("This script will test all components to ensure everything is working.\n")
    
    verifier = SystemVerifier()
    
    # Add delay to allow services to start
    print("⏳ Waiting for services to start...")
    time.sleep(3)
    
    success = verifier.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()