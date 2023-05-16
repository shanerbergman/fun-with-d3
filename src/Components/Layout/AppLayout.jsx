import React from "react";
import { Breadcrumb, Layout, Menu, theme, Typography } from "antd";
import Grid from "./Grid";

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;
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
        <Typography.Title level={3} style={{ margin: 0, color: "#f5f5f5" }}>
          <div>Fun with D3 - Visualization with React & D3</div>
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
