import * as React from "react";
import styles from "./UserDirectory.module.scss";
import type { IUserDirectoryProps } from "./IUserDirectoryProps";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { Card } from "antd";
// import { faCopy } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserDirectory = (props: IUserDirectoryProps) => {
  const [userDetails, setUserDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        const client = await props.context.msGraphClientFactory.getClient("3");
        const users = await client
          .api("/users")
          .select("id,displayName,mail,jobTitle,userPrincipalName,department")
          .get();

        const usersData = users.value;

        setUserDetails(usersData);
      } catch (error) {
        console.log(error);
      }
    }

    getUserData();
  }, [props.context.msGraphClientFactory]);
  // console.log("data", userDetails);

  const filteredUsers = userDetails.filter((user: any) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (email: any) => {
    navigator.clipboard.writeText(email);
  };

  var newStyles = `
  :where(.css-1rqnfsa).ant-card .ant-card-body {
    padding: 24px 0 24px 24px;
  }

  :where(.css-dev-only-do-not-override-1rqnfsa).ant-card .ant-card-body {
    padding: 24px 0 24px 24px;
  }
  `;

  return (
    <>
      <style>{newStyles}</style>
      <div className={styles.header}>
        <div className={styles.heading}>Employee Directory</div>
        <div className={styles.searchBox}>
          <img src={require("../assets/search.svg")} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
        </div>
      </div>
      <div className={styles.employeeCardContainer}>
        <div className={styles.employeeCard}>
          {filteredUsers.map((user: any) => (
            <Card key={user.id} className={styles.card}>
              <div>
                <div className={styles.topFlex}>
                  <div>
                    <img
                      src={`/_layouts/15/userphoto.aspx?size=L&username=${user.userPrincipalName}`}
                      alt={user.displayName}
                      className={styles.userPhoto}
                    />
                  </div>
                  <div>
                    <p className={styles.userName}>{user.displayName}</p>
                    <p className={styles.jobTitle}>
                      {user.jobTitle} - {user.department}
                    </p>
                  </div>
                </div>
                <div className={styles.bottomFlex}>
                  <div style={{ color: "#242424" }}>Mail ID:</div>
                  <div className={styles.mail}>
                    <span>{user.mail}</span>
                    {/* <FontAwesomeIcon
                  icon={faCopy}
                  onClick={() => copyToClipboard(user.mail)}
                  style={{ cursor: "pointer" }}
                /> */}
                    <img
                      src={require("../assets/copymail.svg")}
                      alt="Copy"
                      onClick={() => copyToClipboard(user.mail)}
                      style={{
                        cursor: "pointer",
                        width: "12px",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDirectory;
