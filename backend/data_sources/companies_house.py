import os
import requests
import logging
from typing import Dict, List, Optional, Union
from datetime import datetime
import time
from base64 import b64encode

logger = logging.getLogger(__name__)

class CompaniesHouseClient:
    """
    Companies House API client for fetching UK company data.
    
    Provides methods to search companies and fetch detailed information
    including filings, officers, and financial data.
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("COMPANIES_HOUSE_API_KEY")
        if not self.api_key:
            raise ValueError("Companies House API key is required")
            
        self.base_url = "https://api.company-information.service.gov.uk"
        self.session = requests.Session()
        
        # Companies House uses HTTP Basic Auth with API key as username
        auth_string = f"{self.api_key}:"
        encoded_auth = b64encode(auth_string.encode()).decode()
        self.session.headers.update({
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/json",
            "User-Agent": "UK-Customer-Intelligence-Platform/1.0"
        })
        
        # Rate limiting: 600 requests per 5 minutes
        self.rate_limit_calls = []
        self.max_calls_per_window = 600
        self.window_seconds = 300
    
    def _check_rate_limit(self):
        """Ensure we don't exceed the API rate limit."""
        now = time.time()
        
        # Remove calls outside the current window
        self.rate_limit_calls = [
            call_time for call_time in self.rate_limit_calls 
            if now - call_time < self.window_seconds
        ]
        
        if len(self.rate_limit_calls) >= self.max_calls_per_window:
            sleep_time = self.window_seconds - (now - self.rate_limit_calls[0])
            logger.warning(f"Rate limit reached. Sleeping for {sleep_time:.1f} seconds")
            time.sleep(sleep_time + 1)
            self.rate_limit_calls = []
        
        self.rate_limit_calls.append(now)
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make a request to the Companies House API with error handling."""
        self._check_rate_limit()
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            if response.status_code == 404:
                logger.warning(f"Resource not found: {url}")
                return None
            elif response.status_code == 429:
                logger.warning("Rate limit exceeded")
                time.sleep(60)
                return self._make_request(endpoint, params)
            else:
                logger.error(f"HTTP error {response.status_code}: {e}")
                raise
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
            raise
    
    def search_companies(self, query: str, items_per_page: int = 20, start_index: int = 0) -> Dict:
        """
        Search for companies by name or company number.
        
        Args:
            query: Company name or number to search for
            items_per_page: Number of results per page (max 100)
            start_index: Starting index for pagination
            
        Returns:
            Dict containing search results and metadata
        """
        params = {
            "q": query,
            "items_per_page": min(items_per_page, 100),
            "start_index": start_index
        }
        
        logger.info(f"Searching companies: {query}")
        result = self._make_request("/search/companies", params)
        
        if result:
            logger.info(f"Found {result.get('total_results', 0)} companies matching '{query}'")
        
        return result
    
    def get_company_profile(self, company_number: str) -> Dict:
        """
        Get detailed company profile information.
        
        Args:
            company_number: The company registration number
            
        Returns:
            Dict containing company profile data
        """
        logger.info(f"Fetching company profile: {company_number}")
        return self._make_request(f"/company/{company_number}")
    
    def get_company_officers(self, company_number: str, items_per_page: int = 35, start_index: int = 0) -> Dict:
        """
        Get company officers (directors, secretaries, etc.).
        
        Args:
            company_number: The company registration number
            items_per_page: Number of results per page (max 100)
            start_index: Starting index for pagination
            
        Returns:
            Dict containing officers data
        """
        params = {
            "items_per_page": min(items_per_page, 100),
            "start_index": start_index
        }
        
        logger.info(f"Fetching officers for company: {company_number}")
        return self._make_request(f"/company/{company_number}/officers", params)
    
    def get_company_filings(self, company_number: str, items_per_page: int = 25, start_index: int = 0) -> Dict:
        """
        Get company filing history.
        
        Args:
            company_number: The company registration number
            items_per_page: Number of results per page (max 100)
            start_index: Starting index for pagination
            
        Returns:
            Dict containing filing history
        """
        params = {
            "items_per_page": min(items_per_page, 100),
            "start_index": start_index
        }
        
        logger.info(f"Fetching filings for company: {company_number}")
        return self._make_request(f"/company/{company_number}/filing-history", params)
    
    def get_company_charges(self, company_number: str, items_per_page: int = 25, start_index: int = 0) -> Dict:
        """
        Get company charges (mortgages and securities).
        
        Args:
            company_number: The company registration number
            items_per_page: Number of results per page (max 100)
            start_index: Starting index for pagination
            
        Returns:
            Dict containing charges data
        """
        params = {
            "items_per_page": min(items_per_page, 100),
            "start_index": start_index
        }
        
        logger.info(f"Fetching charges for company: {company_number}")
        return self._make_request(f"/company/{company_number}/charges", params)
    
    def get_company_insolvency(self, company_number: str) -> Dict:
        """
        Get company insolvency information.
        
        Args:
            company_number: The company registration number
            
        Returns:
            Dict containing insolvency data
        """
        logger.info(f"Fetching insolvency data for company: {company_number}")
        return self._make_request(f"/company/{company_number}/insolvency")
    
    def get_full_company_data(self, company_number: str) -> Dict:
        """
        Get comprehensive company data including profile, officers, and recent filings.
        
        Args:
            company_number: The company registration number
            
        Returns:
            Dict containing all available company data
        """
        logger.info(f"Fetching full company data: {company_number}")
        
        data = {
            "company_number": company_number,
            "fetched_at": datetime.utcnow().isoformat(),
            "profile": None,
            "officers": None,
            "recent_filings": None,
            "charges": None,
            "insolvency": None
        }
        
        # Get basic profile (required)
        profile = self.get_company_profile(company_number)
        if not profile:
            logger.error(f"Could not fetch profile for company {company_number}")
            return None
        
        data["profile"] = profile
        
        # Get additional data (optional)
        try:
            data["officers"] = self.get_company_officers(company_number, items_per_page=10)
        except Exception as e:
            logger.warning(f"Could not fetch officers for {company_number}: {e}")
        
        try:
            data["recent_filings"] = self.get_company_filings(company_number, items_per_page=10)
        except Exception as e:
            logger.warning(f"Could not fetch filings for {company_number}: {e}")
        
        try:
            data["charges"] = self.get_company_charges(company_number, items_per_page=10)
        except Exception as e:
            logger.warning(f"Could not fetch charges for {company_number}: {e}")
        
        try:
            data["insolvency"] = self.get_company_insolvency(company_number)
        except Exception as e:
            logger.warning(f"Could not fetch insolvency for {company_number}: {e}")
        
        return data
    
    def normalize_company_data(self, raw_data: Dict) -> Dict:
        """
        Normalize raw Companies House data into our standard format.
        
        Args:
            raw_data: Raw data from get_full_company_data()
            
        Returns:
            Dict containing normalized company data
        """
        if not raw_data or not raw_data.get("profile"):
            return None
        
        profile = raw_data["profile"]
        
        # Extract key information
        normalized = {
            "company_number": profile.get("company_number"),
            "company_name": profile.get("company_name"),
            "company_status": profile.get("company_status"),
            "company_type": profile.get("type"),
            "incorporation_date": profile.get("date_of_creation"),
            "dissolution_date": profile.get("date_of_dissolution"),
            "jurisdiction": profile.get("jurisdiction"),
            "sic_codes": profile.get("sic_codes", []),
            "registered_office_address": profile.get("registered_office_address", {}),
            "accounts": profile.get("accounts", {}),
            "confirmation_statement": profile.get("confirmation_statement", {}),
            "links": profile.get("links", {}),
            
            # Additional processed data
            "is_active": profile.get("company_status", "").lower() == "active",
            "has_charges": bool(raw_data.get("charges", {}).get("total_count", 0)),
            "has_insolvency": bool(raw_data.get("insolvency")),
            "officer_count": raw_data.get("officers", {}).get("total_count", 0),
            "recent_filing_count": raw_data.get("recent_filings", {}).get("total_count", 0),
            
            # Metadata
            "fetched_at": raw_data.get("fetched_at"),
            "raw_data": raw_data  # Store complete raw data for future use
        }
        
        # Add risk indicators
        normalized["risk_indicators"] = self._calculate_risk_indicators(normalized)
        
        return normalized
    
    def _calculate_risk_indicators(self, company_data: Dict) -> Dict:
        """Calculate basic risk indicators from company data."""
        indicators = {
            "overdue_accounts": False,
            "overdue_confirmation_statement": False,
            "has_charges": company_data.get("has_charges", False),
            "has_insolvency_history": company_data.get("has_insolvency", False),
            "is_dormant": False,
            "risk_score": 0
        }
        
        # Check if accounts are overdue
        accounts = company_data.get("accounts", {})
        if accounts.get("overdue"):
            indicators["overdue_accounts"] = True
            indicators["risk_score"] += 3
        
        # Check if confirmation statement is overdue
        cs = company_data.get("confirmation_statement", {})
        if cs.get("overdue"):
            indicators["overdue_confirmation_statement"] = True
            indicators["risk_score"] += 2
        
        # Check for charges
        if indicators["has_charges"]:
            indicators["risk_score"] += 1
        
        # Check for insolvency history
        if indicators["has_insolvency_history"]:
            indicators["risk_score"] += 5
        
        # Check if company is inactive
        if not company_data.get("is_active"):
            indicators["risk_score"] += 4
        
        return indicators


# Convenience functions for easy usage
def search_companies(query: str, api_key: str = None) -> Dict:
    """Quick search for companies."""
    client = CompaniesHouseClient(api_key)
    return client.search_companies(query)

def get_company_data(company_number: str, api_key: str = None) -> Dict:
    """Quick fetch of complete company data."""
    client = CompaniesHouseClient(api_key)
    raw_data = client.get_full_company_data(company_number)
    if raw_data:
        return client.normalize_company_data(raw_data)
    return None

# Example usage
if __name__ == "__main__":
    # Test with Tesco
    client = CompaniesHouseClient()
    
    # Search for Tesco
    search_results = client.search_companies("Tesco")
    print(f"Search results: {search_results}")
    
    # Get full data for Tesco (company number: 00445790)
    tesco_data = get_company_data("00445790")
    print(f"Tesco data: {tesco_data}")