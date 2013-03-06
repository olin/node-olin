var ntlm = require('ntlm')
  , agentkeepalive = require('agentkeepalive')
  , request = require('request')
  , xml2js = require('xml2js');

function flattenXmlStructure (arr) {
  for (var key in arr) {
    // Rename keys.
    var value = arr[key];
    delete arr[key];
    key = key.replace(/^\w+\:/, '').replace(/^[A-Z]/, function (l) {
      return l.toLowerCase();
    });
    arr[key] = value;

    // Convert arrays down.
    if (arr[key].length == 1) {
      arr[key] = arr[key][0];
    } else if (arr[key].length == 0) {
      arr[key] = null;
    }

    if (typeof arr[key] == 'object') {
      flattenXmlStructure(arr[key]);
    }
  }
  return arr;
}

function networkLogin (username, password, next) {
  var url = "https://webmail.olin.edu/ews/exchange.asmx"
    , hostname = 'webmail.olin.edu'
    , domain = 'MILKYWAY';

  var body = '<?xml version="1.0" encoding="utf-8"?>\n\
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n\
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">\n\
    <soap:Body>\n\
      <ResolveNames xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"\n\
      xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"\n\
      ReturnFullContactData="true">\n\
        <UnresolvedEntry>' + username + '</UnresolvedEntry>\n\
      </ResolveNames>\n\
    </soap:Body>\n\
  </soap:Envelope>';

  var ntlmrequest = request.defaults({
    agentClass: agentkeepalive.HttpsAgent
  });

  ntlmrequest(url, {
    headers: {
      'Authorization': ntlm.challengeHeader(hostname, domain),
    }
  }, function (err, res) {
    ntlmrequest.post(url, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Authorization': ntlm.responseHeader(res, url, domain, username, password)
      },
      body: body
    }, function (err, res, body) {
      xml2js.parseString(body, function (err, xml) {
        try {
          var match = xml['soap:Envelope']['soap:Body'][0]['m:ResolveNamesResponse'][0]['m:ResponseMessages'][0]['m:ResolveNamesResponseMessage'][0]['m:ResolutionSet'][0]['t:Resolution'][0];
          
          next(err, flattenXmlStructure(match));
        } catch (e) {
          next(err, null);
        }
      });
    });
  });
}

exports.networkLogin = networkLogin;