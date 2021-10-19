'use strict';

const follower = require('../follow-redirect-url');
const chai = require('chai');
const expect = chai.expect;
const webserver = require('./webserver');

describe('follow-redirect-url', () => {

  before(() => {
    webserver.start();
  });

  it('should return an array with urls and status codes', () => {
    return follower.startFollowing('http://localhost:9000/3').then(visits => {
      expect(visits).to.deep.equal(expectedStatusCodesOnly);
    });
  });

  it('should cope with up to 20 (Default Limit) redirects', () => {
    return follower.startFollowing('http://localhost:9000/20').then(visits => {
      expect(visits.length).to.equal(20);
    });
  });

  it('should fail if more than 20 (Default Limit) redirects', () => {
    return follower.startFollowing('http://localhost:9000/21').then(visits => {
      expect().to.throw();
    }).catch(error => {
      expect(error).to.equal('Exceeded max redirect depth of 20');
    });
  });

  it('should cope with up to 5 (pass 5 in fn argument) redirects', () => {
    const options = { max_redirect_length: 5 };
    return follower.startFollowing('http://localhost:9000/5', options).then(visits => {
      expect(visits.length).to.equal(5);
    });
  });

  it('should fail if more than 5 (pass 5 in fn argument)  redirects', () => {
    const options = { max_redirect_length: 5 };
    return follower.startFollowing('http://localhost:9000/6', options).then(visits => {
      expect().to.throw();
    }).catch(error => {
      expect(error).to.equal('Exceeded max redirect depth of 5');
    });
  });

  it('should fail if status code redirect without location header', () => {
    return follower.startFollowing('http://localhost:9000/nolocation').then(visits => {
      expect(visits[0].redirect).to.equal(false);
      expect(visits[0].status).to.equal('Error: http://localhost:9000/nolocation responded with status 302 but no location header');
    });
  });

  it('should add missing http prefix in links', () => {
    return follower.startFollowing('localhost:9000/1').then(visits => {
      expect(visits[0].status).to.equal(200);
    });
  });

  it('should handle 200 + meta refresh tag', () => {
    return follower.startFollowing('localhost:9000/meta').then(visits => {
      return expect(visits).to.deep.equal(expectedWithMetaRefresh);
    });
  });

  it('should handle expected status codes only', () => {
    return follower.startFollowing('localhost:9000/3').then(visits => {
      return expect(visits).to.deep.equal(expectedStatusCodesOnly);
    });
  });

  it('should reject invalid URLs', () => {
    return follower.startFollowing('bogus://something').then(visits => {
      return expect(visits).to.deep.oneOf([
          [{
            "error": "ENOTFOUND",
            "redirect": false,
            "status": "Error: FetchError: request to http://bogus//something failed, reason: getaddrinfo ENOTFOUND bogus",
            "url": "bogus://something"
          }],
          // on GH CI runtime the exact error code is different
          [{
            "error": "EAI_AGAIN",
            "redirect": false,
            "status": "Error: FetchError: request to http://bogus//something failed, reason: getaddrinfo EAI_AGAIN bogus",
            "url": "bogus://something"
          }]
        ])
    });
  });

  const expectedStatusCodesOnly = [
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:9000/3',
      'redirectUrl': 'http://localhost:9000/2'
    },
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:9000/2',
      'redirectUrl': 'http://localhost:9000/1'
    },
    {
      'redirect': false,
      'status': 200,
      'url': 'http://localhost:9000/1'
    }
  ];

  const expectedWithMetaRefresh = [
    {
      'redirect': true,
      'status': '200 + META REFRESH',
      'url': 'http://localhost:9000/meta',
      'redirectUrl': 'http://localhost:9000/1'
    },
    {
      'status': 200,
      'redirect': false,
      'url': 'http://localhost:9000/1'
    }
  ];

});