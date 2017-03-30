function tin() {
 
  // set up client 
 var efx = EffexApiClient;
  
 // boss key comes from console /// replace this with your own
 var bossKey ="bx2be-4fe-egoeibbk21k1";


 //Check service is up
  var result = efx.ping();
  if (!result.ok) throw 'problem with the service:' + result.error;
  
  //get an access key
  var result = efx.generateKey (bossKey, "writer");
  if (!result.ok) throw 'problem with the service:' + result.error;
  
  // store that for later
  var writer = result.keys[0];
  
  // write something
  var result = efx.write ("something",writer);
  if (!result.ok) throw 'problem with writing :' + result.error;
  
  // save for later
  var id = result.id;
  
  // read it back normally
  var result = efx.read (id, writer);
  if (!result.ok) throw 'problem with reading :' + result.error;
  
  // read it back but put a hold on it
  var result = efx.read (id, writer, {intention:"update"});
  if (!result.ok) throw 'problem with intention reading :' + result.error;
  
  // save it for later
  var intent = result.intent;

  // try to write to it without the intention, it'll fail
  var result = efx.update ("some more data", id, writer);
  if (result.ok) throw 'should have blocked update';
  
  // take a look at the result
  Logger.log(result);  
  
  // if you want to wait till its available
  //Utilities.sleep (result.intentExpires * 1000 );
 ///var result = efx.update ("some more data", id, writer);
  //if (!result.ok) throw 'lock should have cleared :' + result.error;

  // .. or if you do it with the intent
  var result = efx.update ("some more data", id, writer, "post" , {
    intent:intent
  });
  if (!result.ok) throw 'problem with intention updating :' + result.error;
  
  
}

