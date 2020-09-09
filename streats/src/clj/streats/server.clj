(ns streats.server
    (:require
     [streats.handler :refer [app]]
     [clojure.java.jdbc :as sql]
     [config.core :refer [env]]     
     [ring.adapter.jetty :refer [run-jetty]])
    (:gen-class))

(def mysql-db
  (let [app-url "//127.0.0.1"
        db "/information_schema"
        mysql-server-port 3306
        usr "andy"
        pw "local"]
    {:subprotocol "mysql"
     :subname (str app-url ":" mysql-server-port db
                   "?useJDBCCompliantTimezoneShift=true&serverTimezone=UTC&characterEncoding=utf8&useSSL=false&useUnicode=true")
     :user usr :password pw}))

(defn -main [& args]
  (let [port (or (env :port) 3000)]    
    (run-jetty #'app {:port port :join? false})))



(comment
  "READ"
  (sql/query mysql-db
             ["select first_name from employee"] ;;build query string here
             {:row-fn :first_name} ;;define return fields
             );; => ("john")
  "CREATE"
  (sql/insert! mysql-db
               :employee
               {:first_name "Foo" :last_name "Bar" 
                :sex "M" :age 30 :income 1337})
  "DESTROY"
  (sql/delete! mysql-db :employee
               ["age = ? " 30])
  "UPDATE"
  (sql/update! mysql-db
               :employee
               {:income 40}
               ["age = ? " 30])
  "ACID TRANSACTIONS"
  (sql/with-db-transaction [t-con mysql-db]
    (sql/update! t-con :employee {:income 40} ["age = ? " 30]))
  )
