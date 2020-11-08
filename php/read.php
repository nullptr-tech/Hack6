<?php
    $dbh = new PDO('pgsql:host=localhost;port=26257;dbname=bank;sslmode=require;sslrootcert=certs/ca.crt;sslkey=certs/client.maxroach.key;sslcert=certs/client.maxroach.crt',
    'maxroach', null, array(
      PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_EMULATE_PREPARES => true,
      PDO::ATTR_PERSISTENT => true
    ));

    if( $dbh ) {
        echo "Connection established.<br />";
    }else{
        echo "Connection could not be established.<br />";
        die( print_r( sqlsrv_errors(), true));
    }

    // 5432
?>