import sys
import os 
import datetime
import unittest

function_directory = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
sys.path.insert(0,function_directory)

from generate import generate_dates, generate_graph

class TestAnalysisAPI(unittest.TestCase):
    
    def test_generate_dates(self):
        result = generate_dates(datetime.datetime(2020, 2, 2), datetime.datetime(2020, 2, 5))
        self.assertEqual(len(result), 4, "should be 4")

    def test_generate_graph(self):
        recordings = [20.3,33.3,55.5,66.7]
        result = generate_dates(datetime.datetime(2020, 2, 2), datetime.datetime(2020, 2, 5))
        generate_graph("Mumbai",result,recordings,"juhi","temprature_recordings")

if __name__ == '__main__':
    unittest.main()