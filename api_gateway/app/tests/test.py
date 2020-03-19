import sys
import os
import datetime
import unittest
crypto = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
sys.path.insert(0,crypto)
from handlers.crypto_handler import CryptoHandler

class TestCryptoHandler(unittest.TestCase):
    def test_encrypt_the_string(self):
        c = CryptoHandler()
        c = c.encrypt_the_string("raj")
        self.assertTrue(len(c)>0,"Should not be empty")
    def test_verify_encrypted_string(self):
        c = CryptoHandler()
        self.assertTrue(c.verify_encrypted_string("raj", c.encrypt_the_string("raj")))

if __name__ == '__main__':
    unittest.main()
    
     # Test peer view Jenkins trigger.
