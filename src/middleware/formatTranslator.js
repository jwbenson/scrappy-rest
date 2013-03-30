var jstoxml = require('jstoxml');
exports.send = function(req, res, data){
    var toXML = false;
    if(toXML){
        if(Array.isArray(data))
        {
            data = {
                items: data
            };
        }
        res.contentType('text/xml; charset=utf-8');
        res.send(jstoxml.toXML(data));
    } 
    else {
        res.send(data);
    }
}