#!/usr/bin/env python3
import unittest
import os
import tempfile
from app import app

class InteractivePresentationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
    def test_home_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'PowerPoint', response.data)
        
    def test_configure_page_redirect(self):
        response = self.app.get('/configure')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'error', response.data)
        
    def test_process_page_redirect(self):
        response = self.app.get('/process')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'error', response.data)

if __name__ == '__main__':
    unittest.main()