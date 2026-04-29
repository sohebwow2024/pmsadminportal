import React, { useEffect, useState } from "react";
import { FaArchive } from "react-icons/fa";
import {
  Button,
  Card,
  Input,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import "./Plans.css";

const defaultPlanTabs = ["PMS", "LLM", "CRM", "RESTAURANT"];

const billingCycleOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "INR", label: "INR" },
  { value: "EUR", label: "EUR" },
];

const moduleOptions = [
  { value: "Front Office", label: "Front Office" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Pos", label: "Pos" },
  { value: "Reports", label: "Reports" },
  { value: "Accounting", label: "Accounting" },
  { value: "Integrations", label: "Integrations" },
];

const createDefaultForm = () => ({
  name: "",
  product: "",
  category: "PMS",
  price: "",
  billingCycle: "",
  currency: "",
  duration: "",
  description: "",
  includedModules: [],
});

const initialPlanCatalog = {
  PMS: [
    {
      name: "Monthly",
      price: "99.00",
      billingCycle: "monthly",
      currency: "USD",
      duration: "30",
      description: "Starter PMS plan for boutique hotels",
      includedModules: ["Front Office", "Housekeeping"],
      billingText: "per month",
      status: "Active",
    },
    {
      name: "Quarterly",
      price: "279.00",
      billingCycle: "quarterly",
      currency: "USD",
      duration: "90",
      description: "Operational package for growing hotel teams",
      includedModules: ["Front Office", "Housekeeping", "Pos", "Reports"],
      billingText: "per quarter",
      status: "Active",
    },
    {
      name: "Yearly",
      price: "1,049.00",
      billingCycle: "yearly",
      currency: "USD",
      duration: "365",
      description: "Complete PMS suite with finance and integrations",
      includedModules: [
        "Front Office",
        "Housekeeping",
        "Pos",
        "Reports",
        "Accounting",
        "Integrations",
      ],
      billingText: "per 365 days",
      status: "Active",
    },
  ],
  LLM: [
    {
      name: "Monthly",
      price: "149.00",
      billingCycle: "monthly",
      currency: "USD",
      duration: "30",
      description: "AI assistant plan for guest messaging and drafts",
      includedModules: ["Front Office", "Reports"],
      billingText: "per month",
      status: "Active",
    },
    {
      name: "Quarterly",
      price: "429.00",
      billingCycle: "quarterly",
      currency: "USD",
      duration: "90",
      description: "Automation bundle for reservation and team workflows",
      includedModules: ["Front Office", "Reports", "Accounting"],
      billingText: "per quarter",
      status: "Active",
    },
    {
      name: "Yearly",
      price: "1,599.00",
      billingCycle: "yearly",
      currency: "USD",
      duration: "365",
      description: "Enterprise AI plan with analytics and integrations",
      includedModules: ["Front Office", "Reports", "Accounting", "Integrations"],
      billingText: "per 365 days",
      status: "Active",
    },
  ],
  CRM: [
    {
      name: "Monthly",
      price: "79.00",
      billingCycle: "monthly",
      currency: "USD",
      duration: "30",
      description: "Guest relationship tools for small sales teams",
      includedModules: ["Front Office", "Reports"],
      billingText: "per month",
      status: "Active",
    },
    {
      name: "Quarterly",
      price: "225.00",
      billingCycle: "quarterly",
      currency: "USD",
      duration: "90",
      description: "Campaign and retention package for repeat guests",
      includedModules: ["Front Office", "Reports", "Integrations"],
      billingText: "per quarter",
      status: "Active",
    },
    {
      name: "Yearly",
      price: "840.00",
      billingCycle: "yearly",
      currency: "USD",
      duration: "365",
      description: "Full CRM plan with reporting and automation support",
      includedModules: ["Front Office", "Reports", "Accounting", "Integrations"],
      billingText: "per 365 days",
      status: "Active",
    },
  ],
  RESTAURANT: [
    {
      name: "Monthly",
      price: "129.00",
      billingCycle: "monthly",
      currency: "USD",
      duration: "30",
      description: "Restaurant operations plan for daily POS billing",
      includedModules: ["Pos", "Reports"],
      billingText: "per month",
      status: "Active",
    },
    {
      name: "Quarterly",
      price: "369.00",
      billingCycle: "quarterly",
      currency: "USD",
      duration: "90",
      description: "Mid-tier dining package with kitchen reporting",
      includedModules: ["Pos", "Reports", "Accounting"],
      billingText: "per quarter",
      status: "Active",
    },
    {
      name: "Yearly",
      price: "1,389.00",
      billingCycle: "yearly",
      currency: "USD",
      duration: "365",
      description: "Full restaurant suite with stock and outlet sync",
      includedModules: ["Pos", "Reports", "Accounting", "Integrations"],
      billingText: "per 365 days",
      status: "Active",
    },
  ],
};

const initialPlans = defaultPlanTabs.flatMap((tab) =>
  (initialPlanCatalog[tab] || []).map((plan, index) => ({
    ...plan,
    id: `${tab.toLowerCase()}-${index + 1}`,
    product: tab,
    category: tab,
  })),
);

const currencySymbolMap = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

const isRequiredFilled = (form) =>
  form.name.trim() !== "" &&
  form.product.trim() !== "" &&
  form.price !== "" &&
  form.billingCycle !== "" &&
  form.currency !== "" &&
  form.duration !== "" &&
  form.includedModules.length > 0;

const formatPrice = (price, currency) => {
  const normalized = String(price ?? "").replace(/,/g, "");
  const parsedPrice = Number(normalized);

  if (Number.isNaN(parsedPrice)) {
    return `${currencySymbolMap[currency] || ""}${price}`;
  }

  return `${currencySymbolMap[currency] || ""}${parsedPrice.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
};

const getBillingText = (billingCycle, duration) => {
  if (billingCycle === "monthly") return "per month";
  if (billingCycle === "quarterly") return "per quarter";
  if (billingCycle === "yearly") return `per ${duration} days`;
  return `per ${duration} days`;
};

const normalizeProductName = (value) => value.trim();

const getPlanBadgeText = (value) =>
  normalizeProductName(value || "").charAt(0).toUpperCase() || "P";

const getPlanTabs = (plans) => {
  const tabs = [...defaultPlanTabs];

  plans.forEach((plan) => {
    const nextTab = normalizeProductName(plan.category || plan.product || "");

    if (nextTab && !tabs.includes(nextTab)) {
      tabs.push(nextTab);
    }
  });

  return tabs;
};

const Plans = () => {
  const defaultTab = defaultPlanTabs[0];

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Plans";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const [plans, setPlans] = useState(initialPlans);
  const [activeTab, setActiveTab] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [addForm, setAddForm] = useState(createDefaultForm());
  const [editForm, setEditForm] = useState(createDefaultForm());
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const planTabs = getPlanTabs(plans);

  useEffect(() => {
    if (activeTab && !planTabs.includes(activeTab)) {
      setActiveTab("");
    }
  }, [activeTab, defaultTab, planTabs]);

  const updateAddForm = (field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEditForm = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetAddForm = () => {
    setAddForm({
      ...createDefaultForm(),
      category: activeTab || defaultTab,
      product: activeTab || defaultTab,
    });
  };

  const resetEditForm = () => {
    setEditForm(createDefaultForm());
    setSelectedPlanId("");
  };

  const closeAddModal = () => {
    setShowAdd(false);
    resetAddForm();
  };

  const closeEditModal = () => {
    setShowEdit(false);
    resetEditForm();
  };

  const handleCancelOpen = () => {
    setCancelOpen((prev) => {
      if (prev) {
        setSelectedPlanId("");
      }

      return !prev;
    });
  };

  const handleAddPlan = () => {
    if (!isRequiredFilled(addForm)) {
      return;
    }

    const productName = normalizeProductName(addForm.product);

    const newPlan = {
      id: `plan-${Date.now()}`,
      name: addForm.name.trim(),
      product: productName,
      category: productName,
      price: addForm.price,
      billingCycle: addForm.billingCycle,
      currency: addForm.currency,
      duration: addForm.duration,
      description: addForm.description.trim(),
      includedModules: addForm.includedModules,
      billingText: getBillingText(addForm.billingCycle, addForm.duration),
      status: "Active",
    };

    setPlans((prev) => [...prev, newPlan]);
    setActiveTab(productName);
    closeAddModal();
    toast.success("Plan added successfully.", {
      position: "top-center",
    });
  };

  const openEditPlan = (plan) => {
    setSelectedPlanId(plan.id);
    setEditForm({
      name: plan.name,
      product: plan.product,
      category: plan.category,
      price: String(plan.price).replace(/,/g, ""),
      billingCycle: plan.billingCycle,
      currency: plan.currency,
      duration: plan.duration,
      description: plan.description,
      includedModules: plan.includedModules,
    });
    setShowEdit(true);
  };

  const handleEditPlan = () => {
    if (!selectedPlanId || !isRequiredFilled(editForm)) {
      return;
    }

    const productName = normalizeProductName(editForm.product);

    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === selectedPlanId
          ? {
              ...plan,
              name: editForm.name.trim(),
              product: productName,
              category: productName,
              price: editForm.price,
              billingCycle: editForm.billingCycle,
              currency: editForm.currency,
              duration: editForm.duration,
              description: editForm.description.trim(),
              includedModules: editForm.includedModules,
              billingText: getBillingText(
                editForm.billingCycle,
                editForm.duration,
              ),
            }
          : plan,
      ),
    );
    setActiveTab(productName);
    closeEditModal();
    toast.success("Plan updated successfully.", {
      position: "top-center",
    });
  };

  const handleDeletePlan = () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan to delete.", {
        position: "top-center",
      });
      return;
    }

    setPlans((prev) => prev.filter((plan) => plan.id !== selectedPlanId));
    toast.success("Plan deleted successfully.", {
      position: "top-center",
    });
    setSelectedPlanId("");
    setCancelOpen(false);
  };

  const renderPlanModal = ({
    isOpen,
    toggle,
    title,
    form,
    onChange,
    onSubmit,
    submitLabel,
    disableSubmit,
  }) => (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={toggle}>
          <span>
            <h4>{title}</h4>
          </span>
        </ModalHeader>
        <hr className="m-0" />
        <ModalBody className="px-sm-2 pb-2">
          <Form>
            <Row>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-plan-name`}>
                  Plan Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id={`${title}-plan-name`}
                  placeholder="Plan Name"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-product-name`}>
                  Product Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id={`${title}-product-name`}
                  placeholder="Product Name"
                  value={form.product}
                  onChange={(e) => onChange("product", e.target.value)}
                />
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-price`}>
                  Price <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id={`${title}-price`}
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => onChange("price", e.target.value)}
                />
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-billing-cycle`}>
                  Billing Cycle <span className="text-danger">*</span>
                </Label>
                <Select
                  inputId={`${title}-billing-cycle`}
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Billing Cycle"
                  options={billingCycleOptions}
                  value={
                    billingCycleOptions.find(
                      (option) => option.value === form.billingCycle,
                    ) || null
                  }
                  onChange={(option) =>
                    onChange("billingCycle", option?.value || "")
                  }
                />
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-currency`}>
                  Currency <span className="text-danger">*</span>
                </Label>
                <Select
                  inputId={`${title}-currency`}
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Currency"
                  options={currencyOptions}
                  value={
                    currencyOptions.find(
                      (option) => option.value === form.currency,
                    ) || null
                  }
                  onChange={(option) => onChange("currency", option?.value || "")}
                />
              </Col>
              <Col lg="6" className="mb-1">
                <Label className="form-label" for={`${title}-duration`}>
                  Duration <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id={`${title}-duration`}
                  placeholder="Duration"
                  value={form.duration}
                  onChange={(e) => onChange("duration", e.target.value)}
                />
              </Col>
              <Col lg="12" className="mb-1">
                <Label className="form-label" for={`${title}-modules`}>
                  Included Modules <span className="text-danger">*</span>
                </Label>
                <Select
                  inputId={`${title}-modules`}
                  isMulti
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Included Modules"
                  options={moduleOptions}
                  value={moduleOptions.filter((option) =>
                    form.includedModules.includes(option.value),
                  )}
                  onChange={(selected) =>
                    onChange(
                      "includedModules",
                      (selected || []).map((option) => option.value),
                    )
                  }
                />
              </Col>
              <Col lg="12" className="mb-1">
                <Label className="form-label" for={`${title}-description`}>
                  Description
                </Label>
                <Input
                  type="textarea"
                  id={`${title}-description`}
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <Row className="px-1">
          <hr className="mt-2" />
          <Col className="text-lg-end text-md-center mt-1 pb-2" xs={12}>
            <Button
              className="me-1 btn btn-danger"
              color="secondary"
              outline
              onClick={toggle}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              {submitLabel}
            </Button>
          </Col>
        </Row>
      </Modal>
      {isOpen ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-start">
          <CardTitle>
            <h2>Subscription Plan</h2>
          </CardTitle>
          <Button
            color="primary"
            onClick={() => {
              setAddForm({
                ...createDefaultForm(),
                category: activeTab || defaultTab,
                product: activeTab || defaultTab,
              });
              setShowAdd(true);
            }}
          >
            Add Plan
          </Button>
        </CardHeader>
      </Card>

      <div className="mb-2">
        <div className="d-flex flex-wrap gap-1">
          {planTabs.map((tab) => (
            <Button
              key={tab}
              color={activeTab === tab ? "primary" : "secondary"}
              outline={activeTab !== tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="plans-grid d-flex flex-wrap justify-content-evenly align-items-stretch">
        {plans
          .filter((plan) => activeTab && plan.category === activeTab)
          .map((plan) => (
              <Card
                key={plan.id}
                className="plan-card border-0 h-100"
              >
                <div className="plan-card__content p-2 pb-1">
                  <div className="plan-card__header d-flex justify-content-between align-items-start gap-1 mb-2">
                    <div className="d-flex align-items-center gap-1">
                      <div className="plan-card__badge">
                        {getPlanBadgeText(plan.product)}
                      </div>
                      <div>
                        <h3 className="plan-card__title mb-25">
                          {plan.name}
                        </h3>
                        <p className="plan-card__subtitle mb-0 fw-semibold">
                          Product: {plan.product}
                        </p>
                      </div>
                    </div>
                    <span className="plan-card__status">
                      {plan.status}
                    </span>
                  </div>

                  <div className="plan-card__price-panel mb-2">
                    <div className="d-flex justify-content-between align-items-end flex-wrap gap-1">
                      <div>
                        <p className="plan-card__price mb-25 fw-bolder">
                          {formatPrice(plan.price, plan.currency)}
                        </p>
                        <p className="plan-card__subtitle mb-0 fw-semibold">
                          {plan.billingText}
                        </p>
                      </div>
                      <div className="plan-card__duration-pill">
                        {plan.duration} Days
                      </div>
                    </div>
                  </div>

                  <div className="plan-card__meta-grid d-flex flex-wrap gap-1 mb-2">
                    <div className="plan-card__meta-box">
                      <p className="plan-card__meta-label mb-25 fw-semibold">
                        Product
                      </p>
                      <p className="plan-card__meta-value mb-0 fw-bold">
                        {plan.product}
                      </p>
                    </div>
                    <div className="plan-card__meta-box">
                      <p className="plan-card__meta-label mb-25 fw-semibold">
                        Duration
                      </p>
                      <p className="plan-card__meta-value mb-0 fw-bold">
                        {plan.duration} Days
                      </p>
                    </div>
                  </div>

                  <div className="plan-card__description-box mb-2">
                    <p className="plan-card__meta-label mb-50 fw-semibold">
                      Description
                    </p>
                    <p className="plan-card__description mb-0">
                      {plan.description}
                    </p>
                  </div>

                  <div className="plan-card__modules mb-1">
                    <div className="d-flex justify-content-between align-items-center gap-1 mb-1">
                      <h4 className="plan-card__modules-title mb-0 fs-5 fw-bolder">
                        Included Modules
                      </h4>
                      <span className="plan-card__modules-count">
                        {plan.includedModules.length} Modules
                      </span>
                    </div>
                    <div className="plan-card__module-list d-flex gap-1 flex-wrap">
                      {plan.includedModules.map((moduleName) => (
                        <span key={moduleName} className="plan-card__module-pill">
                          {moduleName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="plan-card__footer d-flex align-items-center gap-1 p-2 pt-1">
                  <Button
                    color="primary"
                    outline
                    className="plan-card__action plan-card__action--edit"
                    onClick={() => openEditPlan(plan)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    color="primary"
                    className="plan-card__action plan-card__action--clone"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" />
                    </svg>
                    Clone
                  </Button>
                  <Button
                    color="primary"
                    className="plan-card__action plan-card__action--delete"
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setCancelOpen(true);
                    }}
                  >
                    <FaArchive />
                  </Button>
                </div>
              </Card>
          ))}
      </div>

      {!activeTab ? (
        <div className="text-center text-muted mt-2">
          Select a tab to view its plans.
        </div>
      ) : null}

      {renderPlanModal({
        isOpen: showAdd,
        toggle: closeAddModal,
        title: "Add Plan",
        form: addForm,
        onChange: updateAddForm,
        onSubmit: handleAddPlan,
        submitLabel: "Add Plan",
        disableSubmit: !isRequiredFilled(addForm),
      })}

      {renderPlanModal({
        isOpen: showEdit,
        toggle: closeEditModal,
        title: "Update Plan",
        form: editForm,
        onChange: updateEditForm,
        onSubmit: handleEditPlan,
        submitLabel: "Update",
        disableSubmit: !isRequiredFilled(editForm),
      })}

      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Delete Plan
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">Are you sure you want to delete?</h3>
          <Col className="text-center">
            <Button className="m-1" color="primary" onClick={handleCancelOpen}>
              Cancel
            </Button>
            <Button
              className="m-1"
              color="danger"
              onClick={handleDeletePlan}
            >
              Confirm
            </Button>
          </Col>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Plans;
