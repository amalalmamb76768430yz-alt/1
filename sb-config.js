// Supabase configuration file
// This file defines the connection details for the Supabase backend.
// It exposes a global `SB_CONFIG` object which contains the base URL and
// anonymous API key required to access your Supabase project's REST
// interface. The helper method `headers()` returns the correct set of
// headers needed on each request.

;(function () {
  'use strict';

  // These values are provided by the user. Do not modify them here.
  var url = 'https://tngvhezfvgqnouzoyggr.supabase.co';
  var anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3ZoZXpmdmdxbm91em95Z2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzc3NTQsImV4cCI6MjA4MjI1Mzc1NH0.uUtcsfrid_QUZhiPELtgscQNJ4kl6l3n9RsH5kR2CvY';

  // Build an object with helper functions for constructing API requests.
  var SB_CONFIG = {
    url: url,
    anonKey: anonKey,
    headers: function () {
      return {
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  };

  // Expose globally
  if (typeof window !== 'undefined') {
    window.SB_CONFIG = SB_CONFIG;
  }
})();
