
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, {ActionType} from '@ant-design/pro-table';
import React, {useState, useRef} from 'react';
import {Dispatch, connect} from 'umi';
import { queryUserList } from '@/services/user';
import CreateEditUser from '@/pages/System/components/CreateEditUser';
import { ConnectState } from '@/models/connect';

interface SystemProps {
  dispatch: Dispatch;
}

const UserList: React.FC<SystemProps> = (props) => {
  const {dispatch} = props;
  const ref = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [row, setRow] = useState<Object>({});

  const editTable = (data: any) => {
    setRow(data);
    handleModalVisible(true)
  }

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text: string, record: any) => [
        <a
          key="editable"
          onClick={() => {
            editTable(record);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  const reloadTable = () => {
    ref.current?.reload();
  }

  const createParams: any = {
    isModalVisible: createModalVisible,
    handleCancel: handleModalVisible,
    dispatch,
    reloadTable,
    row,
  }

  return (
    <PageContainer>
      {createModalVisible && <CreateEditUser {...createParams} />}
      <ProTable
        headerTitle="用户列表"
        rowKey="id"
        columns={columns}
        actionRef={ref}
        pagination={
          {defaultPageSize: 10,}
        }
        toolBarRender={() => [
          <Button type="primary" onClick={() => {
            handleModalVisible(true)
             setRow({})
             }} >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryUserList({ ...params, sorter, filter })}
      />
    </PageContainer>
  )

}

export default connect(({ loading }: ConnectState) => ({
  loading,
}))(UserList);
