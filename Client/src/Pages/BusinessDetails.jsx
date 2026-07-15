import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon,
  MapPin,
  Landmark,
  FileText,
  FileCheck,
  Save,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const BusinessDetails = () => {
  const { hash, username } = useParams();
  const userId = localStorage.getItem("userId");
  const { serverURL } = useContext(TrackForgeContextAPI);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    taxId: "",
    regNumber: "",
    legalName: "",
    additionalNotes: "",
  });

  // Fetch business details on mount
  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await axios.get(`${serverURL}/business-details/${userId}`);
        if (response.data.success && response.data.details) {
          // Merge with default structures in case some address fields are missing
          const fetchedDetails = response.data.details;
          setFormData({
            name: fetchedDetails.name || "",
            logoUrl: fetchedDetails.logoUrl || "",
            email: fetchedDetails.email || "",
            phone: fetchedDetails.phone || "",
            website: fetchedDetails.website || "",
            address: {
              street: fetchedDetails.address?.street || "",
              city: fetchedDetails.address?.city || "",
              state: fetchedDetails.address?.state || "",
              zip: fetchedDetails.address?.zip || "",
              country: fetchedDetails.address?.country || "",
            },
            taxId: fetchedDetails.taxId || "",
            regNumber: fetchedDetails.regNumber || "",
            legalName: fetchedDetails.legalName || "",
            additionalNotes: fetchedDetails.additionalNotes || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch business details:", error);
        toast.error("Error loading business details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId, serverURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warn("Business Name is required");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(
        `${serverURL}/business-details/${userId}`,
        formData
      );
      if (response.data.success) {
        toast.success("Business details saved successfully");
        navigate(`/auth/${hash}/${username}/workspace/settings`);
      } else {
        toast.error(response.data.message || "Failed to save business details");
      }
    } catch (error) {
      console.error("Error saving business details:", error);
      toast.error(
        error.response?.data?.message || "Internal Server Error during save"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[60vh] flex items-center justify-center bg-primary text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium tracking-wider text-secondary">
            Loading business profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[100vh] overflow-y-scroll scrollbar-thin w-full bg-primary text-primary p-6">
      {/* Back button */}
      <Link
        to={`/auth/${hash}/${username}/workspace/settings`}
        className="p-2 mb-6 bg-secondary border border-default text-primary w-fit rounded-xl shadow hover:bg-hover hover:scale-105 transition flex items-center justify-center cursor-pointer"
      >
        <ArrowLeft size={18} />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-4xl bg-card border border-default/40 p-8 rounded-2xl shadow-xl backdrop-blur-md text-primary"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Business & Billing Settings
          </h2>
          <p className="text-xs text-secondary mt-1">
            Configure your descriptive and legal business details. These details
            are automatically mapped to outgoing invoice templates.
          </p>
        </div>

        <div className="space-y-8">
          {/* SECTION 1: DESCRIPTIVE DETAILS */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neon border-b border-default/20 pb-2 mb-4">
              Descriptive Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Brand Name */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Building className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Business Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corporation"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                  required
                />
              </div>

              {/* Logo URL */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <ImageIcon className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Logo URL:
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="e.g. https://domain.com/logo.png"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Business Contact Email */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Mail className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. billing@acme.com"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Business Contact Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Phone className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Business Website */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Globe className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Website:
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.acme.com"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: LEGAL & TAX DETAILS */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neon border-b border-default/20 pb-2 mb-4">
              Legal & Tax Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Registered Legal Name */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Building className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Registered Legal Name:
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  placeholder="Official registered company name"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Tax / VAT Identification */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <Landmark className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Tax / VAT ID:
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="e.g. EIN, VAT, GST or PAN Number"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Company Registration Number */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <FileText className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Company Registration Number:
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleInputChange}
                  placeholder="Official corporate registration / license number"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PHYSICAL ADDRESS */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neon border-b border-default/20 pb-2 mb-4">
              Physical Business Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Street Address */}
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  <MapPin className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                  Street Address:
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="e.g. 123 corporate blvd, suite 500"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="e.g. New York"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* State / Province */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  State / Region:
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="e.g. NY"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Zip / Postal Code */}
              <div className="flex flex-col gap-2">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  Zip / Postal Code:
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.address.zip}
                  onChange={handleAddressChange}
                  placeholder="e.g. 10001"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  Country:
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="e.g. United States"
                  className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: PAYMENT TERMS & ADDITIONAL NOTES */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neon border-b border-default/20 pb-2 mb-4">
              Payment Terms & Bank Details
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-primary flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                <FileCheck className="text-neon bg-neon/10 border border-neon/20 h-7 w-7 p-1.5 rounded-lg" />{" "}
                Notes / Terms / Instructions:
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="e.g. Payments are due within 30 days. Bank Wire info: ACH Route 123456789, Acct 987654321..."
                className="bg-secondary border border-default text-primary rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-neon text-xs resize-none h-32"
              />
            </div>
          </div>
        </div>

        {/* Form Action */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-default/20 pt-6">
          <Link
            to={`/auth/${hash}/${username}/workspace/settings`}
            className="px-4 py-2 border border-default rounded-xl text-primary text-xs hover:bg-hover transition cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] active:scale-[0.98] border border-transparent rounded-xl text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            Save Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessDetails;
