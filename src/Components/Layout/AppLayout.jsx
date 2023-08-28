import React from "react";
import { Layout, Typography } from "antd";
import Grid from "./Grid";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  return (
    <Layout className="layout">
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            color: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>Fun with D3 - Visualization with React & D3</div>
          <div>
            <a
              href={`https://shanebergman.com`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#f5f5f5" }}
            >
              shanebergman.com
            </a>
          </div>
        </Typography.Title>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Grid />
      </Content>
      <Footer style={{ textAlign: "center" }}>Shane Bergman - 2023</Footer>
    </Layout>
  );
};

export default AppLayout;
