<?php
    use PDO;
    $dbh = new PDO('pgsql:host=localhost;port=5432;dbname=bank;sslmode=allow;sslrootcert=certs/ca.crt;sslkey=certs/client.teamnull.key;sslcert=certs/teamnull-hacksheff6-ca.crt',
    'teamnull', null, array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
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