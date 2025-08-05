import { useState, useEffect } from "react"
import { Checkbox, Divider, Input, Modal, Select, Table } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import Button from "components/core-ui/button/button"
import { showErrorMessage } from "utils/messageUtils"
import type { ClientDataParams } from "pages/clients/core/_modals"
import useClientData from "pages/clients/core/hooks/clients"
import type { ClientInfo, FormattedClient } from "pages/services/core/_modals"
import useServiceType from "pages/services/core/hooks/serviceType"

function ServicesModal({ onCancel, open, handleOkButton }: any) {
  const intitialParams: ClientDataParams = {
    limit: 8,
    page: 1,
    search: "",
    sort: "createdAt",
    sortDirection: "desc",
    status: null,
    filters: {},
  }

  const [listing, setListing] = useState({ ...intitialParams })
  const { clientData, isLoading: clientLoading } = useClientData(listing)
  const { serviceTypeData, isLoading: serviceLoading } = useServiceType()
  const [selectedClient, setSelectedClient] = useState<FormattedClient | null>(null)
  const [serviceType, setServiceType] = useState(undefined)
  const [searchText, setSearchText] = useState("")
  const [tableLoading, setTableLoading] = useState(false)
  const [serviceTypeLoading, setServiceTypeLoading] = useState(false)
  const [timer, setSearchTimer] = useState<number | null>(null);


  useEffect(() => {
    setTableLoading(clientLoading)
  }, [clientLoading])

  useEffect(() => {
    setServiceTypeLoading(serviceLoading)
  }, [serviceLoading])

  const handleSelectChange = (value: any) => {
    setServiceType(value)
  }

  const handleClose = () => {
    onCancel();
    setServiceType(undefined);
    setSearchText("")
    setListing({
      ...intitialParams
    })
  }

  const handleCreate = () => {
    if (!selectedClient) {
      showErrorMessage("Please select a client")
      return
    }
    const formData = {
      clientInfo: {
        id: selectedClient._id,
        clientId: selectedClient.basicInformation.clientId,
        clientName: selectedClient.basicInformation.clientName,
        text: selectedClient.basicInformation.clientName,
        value: selectedClient._id,
      },
      serviceType,
    }
    handleOkButton(formData);
    handleClose();
  }

  const formatServiceType = (serviceData: any) => {
    if (!serviceData) return []
    return serviceData.map((t: any) => ({
      value: t._id,
      label: t.name || t.serviceName,
    }))
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    clearTimeout(timer as number);
    const newTimer = setTimeout(() => {
      setListing({
        ...listing,
        search: value,
        page: 1, // Reset to first page when searching
      })
    }, 800);
    setSearchTimer(newTimer);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Handle the case when sorter is empty or undefined
    if (!sorter || Object.keys(sorter).length === 0) {
      setListing({
        ...listing,
        page: pagination.current,
        limit: pagination.pageSize,
      })
      return
    }

    // Process the sort field - handle nested fields properly
    const sortField = sorter.field ? (Array.isArray(sorter.field) ? sorter.field.join(".") : sorter.field) : "createdAt"

    // Fix the sort order determination
    let sortOrder = "desc" // Default
    if (sorter.order) {
      sortOrder = sorter.order === "ascend" ? "asc" : "desc"
    }

    // Process filters
    const activeFilters: Record<string, any> = {}
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].length > 0) {
        activeFilters[key] = filters[key]
      }
    })

    // Update the listing state with the new sort parameters
    setListing({
      ...listing,
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sortField,
      sortDirection: sortOrder,
      filters: activeFilters,
    })
  }

  const columns = [
    {
      title: "Client ID",
      dataIndex: ["basicInformation", "clientId"],
      key: "clientId",
      sorter: true,
      filterable: true,
    },
    {
      title: "Client Name",
      dataIndex: ["basicInformation", "clientName"],
      key: "clientName",
      sorter: true,
      filterable: true,
    },
    {
      title: "Email",
      dataIndex: ["basicInformation", "emailAddress"],
      key: "email",
      sorter: true,
      filterable: true,
    },
    {
      title: "Select",
      key: "select",
      render: (_: any, record: ClientInfo) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedClient?._id === record._id}
            onChange={() => {
              if (selectedClient?._id === record._id) {
                setSelectedClient(null)
              } else {
                setSelectedClient(record as any)
              }
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <Modal
      style={{ textAlign: "center" }}
      centered
      footer={null}
      onCancel={handleClose}
      open={open}
      width={800}
      className="rounded-xl"
      styles={{ body: { minHeight: "550px" } }}
      title={<p className="text-xl font-semibold text-center">Choose a client for service</p>}
    >
      <Divider />
      <div className="flex mb-4 w-full gap-5">
        <Input
          placeholder="Search clients..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-11 w-1/2 custom-radius"
        />
        <Select
          allowClear
          className="h-11 w-1/4 custom-radius"
          placeholder="Select service type"
          options={formatServiceType(serviceTypeData?.data)}
          value={serviceType}
          onChange={handleSelectChange}
          loading={serviceTypeLoading}
        />
      </div>
      <Table<ClientInfo>
        columns={columns}
        dataSource={clientData?.data}
        rowKey="_id"
        loading={tableLoading}
        pagination={{
          current: clientData?.currentPage,
          pageSize: clientData?.pageSize,
          total: clientData?.totalItems,
          position: ["bottomCenter"],
        }}
        size="middle"
        className="green-header-table"
        onChange={handleTableChange}
        locale={{ emptyText: "No Clients Found" }}
        scroll={{ y: 300 }}
        components={{
          header: {
            row: (props: any) => (
              <tr {...props} className="text-left text-sm font-medium text-gray-500 tracking-wider">
                {props.children}
              </tr>
            ),
            cell: (props: any) => (
              <th
                {...props}
                className="px-6 bg-transparent py-3 text-black text-left text-xs font-medium  tracking-wider"
              />
            ),
          },
          body: {
            row: (props: any) => <tr {...props} className="border-b border-gray-200 last:border-b-0" />,
            cell: (props: any) => <td {...props} className="px-6 py-4  text-sm text-gray-700" />,
          },
        }}
      />
      <div className="flex justify-center gap-3 mt-4">
        <Button
          variant="primary"
          className={`text-base px-14 ${!selectedClient || serviceType === undefined ? "bg-gray-300 cursor-not-allowed" : ""}`}
          onClick={handleCreate}
          disabled={!selectedClient || serviceType === undefined}
        >
          Create
        </Button>
      </div>
    </Modal>
  )
}

export default ServicesModal;
