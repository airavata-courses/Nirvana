import sys
import os 
import datetime
import unittest
dark_sky_directory = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
sys.path.insert(0,dark_sky_directory)
from dark_sky_api_call import city_name_to_coordinates, generate_dates, api_call_to_dark_sky


class TestDarkSkyAPI(unittest.TestCase):

    def test_city_name_to_coordinates(self):
        self.assertEqual(city_name_to_coordinates("Mumbai"), ('18.9387711', '72.8353355'), "Should be ('18.9387711', '72.8353355')")
    
    def test_generate_dates(self):
        result = generate_dates(datetime.datetime(2020, 2, 2), datetime.datetime(2020, 2, 5))
        self.assertEqual(len(result), 4, "should be 4")

    def test_api_call_to_dark_sky(self):
        generated_dates = generate_dates(datetime.datetime(2020, 2, 2), datetime.datetime(2020, 2, 5))
        result = api_call_to_dark_sky(generated_dates, 18.9387711, 72.8353355)
        self.assertEqual(len(result), 4, "should be 4")
        TestDarkSkyAPI.generated_dates = result

if __name__ == '__main__':
    unittest.main()