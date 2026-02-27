import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const tokenKey = "portfolio_admin_token";

type ProjectPayload = {
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
};

type CertificatePayload = {
  title: string;
  issuer: string;
  date?: string;
  description?: string;
  skills?: string[];
  imageUrl?: string;
  link?: string;
};

type HackathonPayload = {
  title: string;
  result?: string;
  focus?: string;
  link?: string;
  date?: string;
  imageUrl?: string;
};

type LinkPayload = {
  label: string;
  url: string;
  category?: string;
};

type ProjectItem = ProjectPayload & { _id: string; createdAt?: string; updatedAt?: string };

type CertificateItem = CertificatePayload & { _id: string; createdAt?: string; updatedAt?: string };

type HackathonItem = HackathonPayload & { _id: string; createdAt?: string; updatedAt?: string };

type LinkItem = LinkPayload & { _id: string };

type AdminRequest = {
  _id: string;
  email: string;
  status: string;
  createdAt?: string;
};

type MessageItem = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

type ProfileItem = {
  imageUrl?: string;
};

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || "");
  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "error">("idle");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);

  const [projectValues, setProjectValues] = useState({
    title: "",
    description: "",
    technologies: "",
    features: "",
    repoUrl: "",
    liveUrl: "",
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState("");
  const [projectPreviewIsObjectUrl, setProjectPreviewIsObjectUrl] = useState(false);
  const [editingProjectImageUrl, setEditingProjectImageUrl] = useState<string | undefined>(undefined);
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectStatus, setProjectStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [projectError, setProjectError] = useState("");
  const [projectSuccessMessage, setProjectSuccessMessage] = useState("");

  const [certificateValues, setCertificateValues] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    skills: "",
    link: "",
  });
  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [certificateImagePreview, setCertificateImagePreview] = useState("");
  const [certificatePreviewIsObjectUrl, setCertificatePreviewIsObjectUrl] = useState(false);
  const [editingCertificateImageUrl, setEditingCertificateImageUrl] = useState<string | undefined>(undefined);
  const [certificateList, setCertificateList] = useState<CertificateItem[]>([]);
  const [certificateStatus, setCertificateStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [certificateError, setCertificateError] = useState("");
  const [certificateSuccessMessage, setCertificateSuccessMessage] = useState("");

  const [hackathonValues, setHackathonValues] = useState({
    title: "",
    result: "",
    focus: "",
    link: "",
    date: "",
  });
  const [hackathonImage, setHackathonImage] = useState<File | null>(null);
  const [hackathonImagePreview, setHackathonImagePreview] = useState("");
  const [hackathonPreviewIsObjectUrl, setHackathonPreviewIsObjectUrl] = useState(false);
  const [editingHackathonImageUrl, setEditingHackathonImageUrl] = useState<string | undefined>(undefined);
  const [hackathonList, setHackathonList] = useState<HackathonItem[]>([]);
  const [hackathonStatus, setHackathonStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hackathonError, setHackathonError] = useState("");
  const [hackathonSuccessMessage, setHackathonSuccessMessage] = useState("");
  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);
  const [linkValues, setLinkValues] = useState({
    label: "",
    url: "",
    category: "social",
  });
  const [linkList, setLinkList] = useState<LinkItem[]>([]);
  const [linkStatus, setLinkStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [linkError, setLinkError] = useState("");
  const [linkSuccessMessage, setLinkSuccessMessage] = useState("");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [adminRequestStatus, setAdminRequestStatus] = useState<"idle" | "loading" | "error">("idle");
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const [messageStatus, setMessageStatus] = useState<"idle" | "loading" | "error">("idle");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profilePreviewIsObjectUrl, setProfilePreviewIsObjectUrl] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileMessage, setProfileMessage] = useState("");

  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const updateProjectPreview = (url: string, isObjectUrl: boolean) => {
    if (projectPreviewIsObjectUrl && projectImagePreview) {
      URL.revokeObjectURL(projectImagePreview);
    }
    setProjectImagePreview(url);
    setProjectPreviewIsObjectUrl(isObjectUrl);
  };

  const updateCertificatePreview = (url: string, isObjectUrl: boolean) => {
    if (certificatePreviewIsObjectUrl && certificateImagePreview) {
      URL.revokeObjectURL(certificateImagePreview);
    }
    setCertificateImagePreview(url);
    setCertificatePreviewIsObjectUrl(isObjectUrl);
  };

  const updateHackathonPreview = (url: string, isObjectUrl: boolean) => {
    if (hackathonPreviewIsObjectUrl && hackathonImagePreview) {
      URL.revokeObjectURL(hackathonImagePreview);
    }
    setHackathonImagePreview(url);
    setHackathonPreviewIsObjectUrl(isObjectUrl);
  };

  const updateProfilePreview = (url: string, isObjectUrl: boolean) => {
    if (profilePreviewIsObjectUrl && profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }
    setProfileImagePreview(url);
    setProfilePreviewIsObjectUrl(isObjectUrl);
  };

  const sortCertificatesByUpdatedAt = (items: CertificateItem[]) =>
    [...items].sort((a, b) => {
      const aValue = Date.parse(a.updatedAt || a.createdAt || "") || 0;
      const bValue = Date.parse(b.updatedAt || b.createdAt || "") || 0;
      return bValue - aValue;
    });

  const sortProjectsByUpdatedAt = (items: ProjectItem[]) =>
    [...items].sort((a, b) => {
      const aValue = Date.parse(a.updatedAt || a.createdAt || "") || 0;
      const bValue = Date.parse(b.updatedAt || b.createdAt || "") || 0;
      return bValue - aValue;
    });

  const sortHackathonsByUpdatedAt = (items: HackathonItem[]) =>
    [...items].sort((a, b) => {
      const aValue = Date.parse(a.updatedAt || a.createdAt || "") || 0;
      const bValue = Date.parse(b.updatedAt || b.createdAt || "") || 0;
      return bValue - aValue;
    });

  useEffect(() => {
    return () => {
      if (projectPreviewIsObjectUrl && projectImagePreview) {
        URL.revokeObjectURL(projectImagePreview);
      }
    };
  }, [projectImagePreview, projectPreviewIsObjectUrl]);

  useEffect(() => {
    return () => {
      if (certificatePreviewIsObjectUrl && certificateImagePreview) {
        URL.revokeObjectURL(certificateImagePreview);
      }
    };
  }, [certificateImagePreview, certificatePreviewIsObjectUrl]);

  useEffect(() => {
    return () => {
      if (hackathonPreviewIsObjectUrl && hackathonImagePreview) {
        URL.revokeObjectURL(hackathonImagePreview);
      }
    };
  }, [hackathonImagePreview, hackathonPreviewIsObjectUrl]);

  useEffect(() => {
    return () => {
      if (profilePreviewIsObjectUrl && profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview, profilePreviewIsObjectUrl]);

  useEffect(() => {
    if (!apiBaseUrl || !token) {
      return;
    }

    const loadData = async () => {
      setMessageStatus("loading");
      try {
        const [projectsResponse, certificatesResponse, hackathonsResponse, linksResponse, messagesResponse, profileResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/projects/admin`, { headers: authHeader }),
          fetch(`${apiBaseUrl}/certificates/admin`, { headers: authHeader }),
          fetch(`${apiBaseUrl}/hackathons/admin`, { headers: authHeader }),
          fetch(`${apiBaseUrl}/links/admin`, { headers: authHeader }),
          fetch(`${apiBaseUrl}/messages`, { headers: authHeader }),
          fetch(`${apiBaseUrl}/profile`),
        ]);

        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          const ordered = Array.isArray(projects) ? sortProjectsByUpdatedAt(projects) : [];
          setProjectList(ordered);
        }

        if (certificatesResponse.ok) {
          const certificates = await certificatesResponse.json();
          const ordered = Array.isArray(certificates)
            ? sortCertificatesByUpdatedAt(certificates)
            : [];
          setCertificateList(ordered);
        }

        if (hackathonsResponse.ok) {
          const hackathons = await hackathonsResponse.json();
          const ordered = Array.isArray(hackathons) ? sortHackathonsByUpdatedAt(hackathons) : [];
          setHackathonList(ordered);
        }

        if (linksResponse.ok) {
          const links = await linksResponse.json();
          setLinkList(Array.isArray(links) ? links : []);
        }

        if (messagesResponse.ok) {
          const messages = await messagesResponse.json();
          setMessageList(Array.isArray(messages) ? messages : []);
        }

        if (profileResponse.ok) {
          const profile = (await profileResponse.json()) as ProfileItem;
          setProfileImageUrl(profile?.imageUrl);
          if (!profileImagePreview) {
            updateProfilePreview(profile?.imageUrl || "", false);
          }
        }

        setMessageStatus("idle");
      } catch (error) {
        setMessageStatus("error");
        // Non-blocking; admin can retry.
      }
    };

    loadData();
  }, [apiBaseUrl, authHeader, token]);

  useEffect(() => {
    if (!apiBaseUrl || !token) {
      return;
    }

    const loadRequests = async () => {
      setAdminRequestStatus("loading");
      try {
        const response = await fetch(`${apiBaseUrl}/admins/requests`, { headers: authHeader });

        if (response.ok) {
          const data = await response.json();
          setAdminRequests(Array.isArray(data) ? data : []);
        }

        setAdminRequestStatus("idle");
      } catch (error) {
        setAdminRequestStatus("error");
      }
    };

    loadRequests();
  }, [apiBaseUrl, authHeader, token]);

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setLoginStatus("error");
      setLoginError("API URL is not configured.");
      return;
    }

    setLoginStatus("loading");
    setLoginError("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginValues),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Login failed");
      }

      const data = await response.json();
      const receivedToken = data?.token || "";
      localStorage.setItem(tokenKey, receivedToken);
      setToken(receivedToken);
      setLoginValues({ email: "", password: "" });
      setLoginStatus("idle");
    } catch (error) {
      setLoginStatus("error");
      setLoginError(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    setToken("");
  };

  const handleProjectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setProjectValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setProjectImage(file || null);
    if (file) {
      updateProjectPreview(URL.createObjectURL(file), true);
    } else if (editingProjectImageUrl) {
      updateProjectPreview(editingProjectImageUrl, false);
    } else {
      updateProjectPreview("", false);
    }
  };

  const handleCertificateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setCertificateValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificateFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCertificateImage(file || null);
    if (file) {
      updateCertificatePreview(URL.createObjectURL(file), true);
    } else if (editingCertificateImageUrl) {
      updateCertificatePreview(editingCertificateImageUrl, false);
    } else {
      updateCertificatePreview("", false);
    }
  };

  const handleHackathonChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setHackathonValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleHackathonFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setHackathonImage(file || null);
    if (file) {
      updateHackathonPreview(URL.createObjectURL(file), true);
    } else if (editingHackathonImageUrl) {
      updateHackathonPreview(editingHackathonImageUrl, false);
    } else {
      updateHackathonPreview("", false);
    }
  };

  const handleProfileFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setProfileImage(file || null);
    if (file) {
      updateProfilePreview(URL.createObjectURL(file), true);
    } else if (profileImageUrl) {
      updateProfilePreview(profileImageUrl, false);
    } else {
      updateProfilePreview("", false);
    }
  };

  const handleLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLinkValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    if (!apiBaseUrl) {
      throw new Error("API URL is not configured.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${apiBaseUrl}/uploads/image`, {
      method: "POST",
      headers: authHeader,
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Image upload failed");
    }

    const data = await response.json();
    return data?.url as string;
  };

  const startEditProject = (item: ProjectItem) => {
    setEditingProjectId(item._id);
    setProjectValues({
      title: item.title,
      description: item.description,
      technologies: item.technologies.join(", "),
      features: item.features.join(", "),
      repoUrl: item.repoUrl || "",
      liveUrl: item.liveUrl || "",
    });
    setEditingProjectImageUrl(item.imageUrl);
    setProjectImage(null);
    updateProjectPreview(item.imageUrl || "", false);
    setProjectStatus("idle");
    setProjectError("");
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditingProjectImageUrl(undefined);
    setProjectValues({
      title: "",
      description: "",
      technologies: "",
      features: "",
      repoUrl: "",
      liveUrl: "",
    });
    setProjectImage(null);
    updateProjectPreview("", false);
  };

  const startEditCertificate = (item: CertificateItem) => {
    setEditingCertificateId(item._id);
    setCertificateValues({
      title: item.title,
      issuer: item.issuer,
      date: item.date || "",
      description: item.description || "",
      skills: (item.skills || []).join(", "),
      link: item.link || "",
    });
    setEditingCertificateImageUrl(item.imageUrl);
    setCertificateImage(null);
    updateCertificatePreview(item.imageUrl || "", false);
    setCertificateStatus("idle");
    setCertificateError("");
  };

  const cancelEditCertificate = () => {
    setEditingCertificateId(null);
    setEditingCertificateImageUrl(undefined);
    setCertificateValues({ title: "", issuer: "", date: "", description: "", skills: "", link: "" });
    setCertificateImage(null);
    updateCertificatePreview("", false);
  };

  const startEditHackathon = (item: HackathonItem) => {
    setEditingHackathonId(item._id);
    setHackathonValues({
      title: item.title,
      result: item.result || "",
      focus: item.focus || "",
      link: item.link || "",
      date: item.date || "",
    });
    setEditingHackathonImageUrl(item.imageUrl);
    setHackathonImage(null);
    updateHackathonPreview(item.imageUrl || "", false);
    setHackathonStatus("idle");
    setHackathonError("");
  };

  const cancelEditHackathon = () => {
    setEditingHackathonId(null);
    setHackathonValues({ title: "", result: "", focus: "", link: "", date: "" });
    setEditingHackathonImageUrl(undefined);
    setHackathonImage(null);
    updateHackathonPreview("", false);
  };

  const startEditLink = (item: LinkItem) => {
    setEditingLinkId(item._id);
    setLinkValues({
      label: item.label,
      url: item.url,
      category: item.category || "social",
    });
    setLinkStatus("idle");
    setLinkError("");
  };

  const cancelEditLink = () => {
    setEditingLinkId(null);
    setLinkValues({ label: "", url: "", category: "social" });
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setProjectStatus("error");
      setProjectError("API URL is not configured.");
      return;
    }

    if (!token) {
      setProjectStatus("error");
      setProjectError("Login required to create projects.");
      return;
    }

    const isEditing = Boolean(editingProjectId);
    setProjectStatus("loading");
    setProjectError("");
    setProjectSuccessMessage("");

    try {
      let imageUrl = editingProjectImageUrl || "";
      if (projectImage) {
        imageUrl = await uploadImage(projectImage);
      }

      const payload: ProjectPayload = {
        title: projectValues.title,
        description: projectValues.description,
        technologies: projectValues.technologies.split(",").map((item) => item.trim()).filter(Boolean),
        features: projectValues.features.split(",").map((item) => item.trim()).filter(Boolean),
        repoUrl: projectValues.repoUrl || undefined,
        liveUrl: projectValues.liveUrl || undefined,
        imageUrl: imageUrl || undefined,
      };

      const response = await fetch(
        `${apiBaseUrl}/projects${isEditing ? `/${editingProjectId}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to create project");
      }

      const saved = await response.json();
      if (isEditing) {
        setProjectList((prev) =>
          sortProjectsByUpdatedAt(prev.map((item) => (item._id === saved._id ? saved : item))),
        );
      } else {
        setProjectList((prev) => sortProjectsByUpdatedAt([...prev, saved]));
      }
      setProjectValues({
        title: "",
        description: "",
        technologies: "",
        features: "",
        repoUrl: "",
        liveUrl: "",
      });
      setProjectImage(null);
      setEditingProjectId(null);
      setEditingProjectImageUrl(undefined);
      updateProjectPreview("", false);
      setProjectSuccessMessage(
        isEditing ? "Project updated successfully." : "Project created successfully.",
      );
      setProjectStatus("success");
    } catch (error) {
      setProjectStatus("error");
      setProjectError(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? "update" : "create"} project`,
      );
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/projects/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (response.ok) {
        setProjectList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      // Ignore delete errors.
    }
  };

  const handleCertificateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setCertificateStatus("error");
      setCertificateError("API URL is not configured.");
      return;
    }

    if (!token) {
      setCertificateStatus("error");
      setCertificateError("Login required to create certificates.");
      return;
    }

    const isEditing = Boolean(editingCertificateId);
    setCertificateStatus("loading");
    setCertificateError("");
    setCertificateSuccessMessage("");

    try {
      let imageUrl = editingCertificateImageUrl || "";
      if (certificateImage) {
        imageUrl = await uploadImage(certificateImage);
      }

      const payload: CertificatePayload = {
        title: certificateValues.title,
        issuer: certificateValues.issuer,
        date: certificateValues.date || undefined,
        description: certificateValues.description || undefined,
        skills: certificateValues.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrl: imageUrl || undefined,
        link: certificateValues.link || undefined,
      };

      const response = await fetch(
        `${apiBaseUrl}/certificates${isEditing ? `/${editingCertificateId}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to create certificate");
      }

      const saved = await response.json();
      if (isEditing) {
        setCertificateList((prev) =>
          sortCertificatesByUpdatedAt(prev.map((item) => (item._id === saved._id ? saved : item))),
        );
      } else {
        setCertificateList((prev) => sortCertificatesByUpdatedAt([...prev, saved]));
      }
      setCertificateValues({ title: "", issuer: "", date: "", description: "", skills: "", link: "" });
      setCertificateImage(null);
      setEditingCertificateId(null);
      setEditingCertificateImageUrl(undefined);
      updateCertificatePreview("", false);
      setCertificateSuccessMessage(
        isEditing ? "Certificate updated successfully." : "Certificate created successfully.",
      );
      setCertificateStatus("success");
    } catch (error) {
      setCertificateStatus("error");
      setCertificateError(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? "update" : "create"} certificate`,
      );
    }
  };

  const handleCertificateDelete = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/certificates/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (response.ok) {
        setCertificateList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      // Ignore delete errors.
    }
  };

  const handleHackathonSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setHackathonStatus("error");
      setHackathonError("API URL is not configured.");
      return;
    }

    if (!token) {
      setHackathonStatus("error");
      setHackathonError("Login required to manage hackathons.");
      return;
    }

    const isEditing = Boolean(editingHackathonId);
    setHackathonStatus("loading");
    setHackathonError("");
    setHackathonSuccessMessage("");

    try {
      let imageUrl = editingHackathonImageUrl || "";
      if (hackathonImage) {
        imageUrl = await uploadImage(hackathonImage);
      }

      const payload: HackathonPayload = {
        title: hackathonValues.title,
        result: hackathonValues.result || undefined,
        focus: hackathonValues.focus || undefined,
        link: hackathonValues.link || undefined,
        date: hackathonValues.date || undefined,
        imageUrl: imageUrl || undefined,
      };

      const response = await fetch(
        `${apiBaseUrl}/hackathons${isEditing ? `/${editingHackathonId}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to save hackathon");
      }

      const saved = await response.json();
      if (isEditing) {
        setHackathonList((prev) =>
          sortHackathonsByUpdatedAt(prev.map((item) => (item._id === saved._id ? saved : item))),
        );
      } else {
        setHackathonList((prev) => sortHackathonsByUpdatedAt([...prev, saved]));
      }
      setHackathonValues({ title: "", result: "", focus: "", link: "", date: "" });
      setEditingHackathonId(null);
      setEditingHackathonImageUrl(undefined);
      setHackathonImage(null);
      updateHackathonPreview("", false);
      setHackathonSuccessMessage(
        isEditing ? "Hackathon updated successfully." : "Hackathon created successfully.",
      );
      setHackathonStatus("success");
    } catch (error) {
      setHackathonStatus("error");
      setHackathonError(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? "update" : "create"} hackathon`,
      );
    }
  };

  const handleHackathonDelete = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/hackathons/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (response.ok) {
        setHackathonList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      // Ignore delete errors.
    }
  };

  const handleLinkSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setLinkStatus("error");
      setLinkError("API URL is not configured.");
      return;
    }

    if (!token) {
      setLinkStatus("error");
      setLinkError("Login required to manage links.");
      return;
    }

    const isEditing = Boolean(editingLinkId);
    setLinkStatus("loading");
    setLinkError("");
    setLinkSuccessMessage("");

    try {
      const payload: LinkPayload = {
        label: linkValues.label,
        url: linkValues.url,
        category: linkValues.category || "social",
      };

      const response = await fetch(
        `${apiBaseUrl}/links${isEditing ? `/${editingLinkId}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to save link");
      }

      const saved = await response.json();
      if (isEditing) {
        setLinkList((prev) => prev.map((item) => (item._id === saved._id ? saved : item)));
      } else {
        setLinkList((prev) => [saved, ...prev]);
      }
      setLinkValues({ label: "", url: "", category: "social" });
      setEditingLinkId(null);
      setLinkSuccessMessage(isEditing ? "Link updated successfully." : "Link created successfully.");
      setLinkStatus("success");
    } catch (error) {
      setLinkStatus("error");
      setLinkError(
        error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} link`,
      );
    }
  };

  const handleLinkDelete = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/links/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (response.ok) {
        setLinkList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      // Ignore delete errors.
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setPasswordStatus("error");
      setPasswordMessage("API URL is not configured.");
      return;
    }

    if (!token) {
      setPasswordStatus("error");
      setPasswordMessage("Login required to change password.");
      return;
    }

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setPasswordStatus("loading");
    setPasswordMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to update password");
      }

      setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStatus("success");
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordStatus("error");
      setPasswordMessage(
        error instanceof Error ? error.message : "Failed to update password",
      );
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setProfileStatus("error");
      setProfileMessage("API URL is not configured.");
      return;
    }

    if (!token) {
      setProfileStatus("error");
      setProfileMessage("Login required to update profile image.");
      return;
    }

    setProfileStatus("loading");
    setProfileMessage("");

    try {
      let imageUrl = profileImageUrl || "";
      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }

      const response = await fetch(`${apiBaseUrl}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ imageUrl: imageUrl || undefined }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to update profile image");
      }

      const updated = (await response.json()) as ProfileItem;
      setProfileImageUrl(updated?.imageUrl);
      setProfileImage(null);
      updateProfilePreview(updated?.imageUrl || "", false);
      setProfileStatus("success");
      setProfileMessage("Profile image updated.");
    } catch (error) {
      setProfileStatus("error");
      setProfileMessage(error instanceof Error ? error.message : "Failed to update profile image");
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/messages/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (response.ok) {
        setMessageList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      // Ignore delete errors.
    }
  };

  const handleApproveAdmin = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    setAdminRequestStatus("loading");
    try {
      const response = await fetch(`${apiBaseUrl}/admins/${id}/approve`, {
        method: "PATCH",
        headers: authHeader,
      });

      if (response.ok) {
        setAdminRequests((prev) => prev.filter((item) => item._id !== id));
      }
      setAdminRequestStatus("idle");
    } catch (error) {
      setAdminRequestStatus("error");
    }
  };

  const handleRejectAdmin = async (id: string) => {
    if (!apiBaseUrl || !token) return;

    setAdminRequestStatus("loading");
    try {
      const response = await fetch(`${apiBaseUrl}/admins/${id}/reject`, {
        method: "PATCH",
        headers: authHeader,
      });

      if (response.ok) {
        setAdminRequests((prev) => prev.filter((item) => item._id !== id));
      }
      setAdminRequestStatus("idle");
    } catch (error) {
      setAdminRequestStatus("error");
    }
  };

  // Analytics removed from this view.

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-3 text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Admin Login</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to access the admin dashboard.
            </p>
          </div>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Use your admin email and password to get a JWT.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginValues.email}
                    onChange={handleLoginChange}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginValues.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    required
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showLoginPassword}
                      onChange={() => setShowLoginPassword((prev) => !prev)}
                    />
                    Show password
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={loginStatus === "loading"}>
                  {loginStatus === "loading" ? "Signing in..." : "Sign In"}
                </Button>
                {loginStatus === "error" && (
                  <p className="text-xs text-red-400">{loginError}</p>
                )}
                <a href="/admin/register" className="text-xs text-muted-foreground underline">
                  Request admin access
                </a>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-8 shadow-lg">
          <div className="absolute inset-0 bg-grid-pattern opacity-15" />
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Admin Console
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Content Command Center
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
              Curate portfolio content, respond to messages, and keep everything current.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
              Pending requests: <span className="text-sm font-semibold text-foreground">{adminRequests.length}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card/70 px-5 py-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Sections
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <a
                  href="#messages"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2 font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  Messages
                </a>
                <a
                  href="#projects-admin"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                >
                  Projects
                </a>
                <a
                  href="#certificates-admin"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                >
                  Certificates
                </a>
                <a
                  href="#hackathons-admin"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                >
                  Hackathons
                </a>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Admin Session</CardTitle>
              <CardDescription>JWT is active for this browser session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground">
                Logged in as admin.
              </div>
              <Button type="button" variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update the admin password securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="newPassword">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <Button type="submit" disabled={passwordStatus === "loading"}>
                  {passwordStatus === "loading" ? "Updating..." : "Update Password"}
                </Button>
                {passwordStatus === "error" && (
                  <p className="text-xs text-red-400">{passwordMessage}</p>
                )}
                {passwordStatus === "success" && (
                  <p className="text-xs text-emerald-400">{passwordMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Upload your hero portrait.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="profile-image">
                    Profile Image
                  </label>
                  <Input
                    id="profile-image"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileFile}
                  />
                  {profileImagePreview && (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="mt-3 h-40 w-full rounded-lg border border-border/60 object-cover"
                    />
                  )}
                  {(profileImagePreview || profileImageUrl) && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline"
                      onClick={() => {
                        setProfileImage(null);
                        updateProfilePreview(profileImageUrl || "", false);
                      }}
                    >
                      Use existing image
                    </button>
                  )}
                </div>
                <Button type="submit" disabled={profileStatus === "loading"}>
                  {profileStatus === "loading" ? "Saving..." : "Save Profile Image"}
                </Button>
                {profileStatus === "error" && (
                  <p className="text-xs text-red-400">{profileMessage}</p>
                )}
                {profileStatus === "success" && (
                  <p className="text-xs text-emerald-400">{profileMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8" id="messages">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>New inquiries sent from the portfolio contact form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {messageStatus === "loading" && (
                <p className="text-xs text-muted-foreground">Loading messages...</p>
              )}
              {messageStatus === "error" && (
                <p className="text-xs text-red-400">Unable to load messages.</p>
              )}
              {messageList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                messageList.map((item) => (
                  <div key={item._id} className="rounded-md border border-border/60 px-3 py-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessageDelete(item._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Admin Access Requests</CardTitle>
              <CardDescription>Approve or reject pending admins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {adminRequestStatus === "loading" && (
                <p className="text-xs text-muted-foreground">Updating requests...</p>
              )}
              {adminRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending admin requests.</p>
              ) : (
                adminRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex flex-col gap-3 rounded-md border border-border/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{request.email}</p>
                      <p className="text-xs text-muted-foreground">Status: {request.status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleApproveAdmin(request._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectAdmin(request._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6">
          <Card className="card-glow" id="projects-admin">
              <CardHeader>
                <CardTitle>{editingProjectId ? "Edit Project" : "New Project"}</CardTitle>
                <CardDescription>
                  Upload a snapshot to Cloudinary and {editingProjectId ? "update" : "create"} a project record.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleProjectSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-title">
                        Title
                      </label>
                      <Input
                        id="project-title"
                        name="title"
                        value={projectValues.title}
                        onChange={handleProjectChange}
                        placeholder="Project name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-image">
                        Project Image
                      </label>
                      <Input
                        id="project-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleProjectFile}
                      />
                      {projectImagePreview && (
                        <img
                          src={projectImagePreview}
                          alt="Project preview"
                          className="mt-3 h-32 w-full rounded-md border border-border/60 object-cover"
                        />
                      )}
                      {(projectImagePreview || editingProjectId) && (
                        <button
                          type="button"
                          className="text-xs text-muted-foreground underline"
                          onClick={() => {
                            setProjectImage(null);
                            updateProjectPreview(editingProjectImageUrl || "", false);
                          }}
                        >
                          Use existing image
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="project-description">
                      Description
                    </label>
                    <Textarea
                      id="project-description"
                      name="description"
                      value={projectValues.description}
                      onChange={handleProjectChange}
                      placeholder="Project summary"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-tech">
                        Technologies (comma-separated)
                      </label>
                      <Input
                        id="project-tech"
                        name="technologies"
                        value={projectValues.technologies}
                        onChange={handleProjectChange}
                        placeholder="Node.js, MongoDB, Express"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-features">
                        Features (comma-separated)
                      </label>
                      <Input
                        id="project-features"
                        name="features"
                        value={projectValues.features}
                        onChange={handleProjectChange}
                        placeholder="JWT auth, CRUD, Admin UI"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-repo">
                        Repo URL
                      </label>
                      <Input
                        id="project-repo"
                        name="repoUrl"
                        value={projectValues.repoUrl}
                        onChange={handleProjectChange}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="project-live">
                        Live URL
                      </label>
                      <Input
                        id="project-live"
                        name="liveUrl"
                        value={projectValues.liveUrl}
                        onChange={handleProjectChange}
                        placeholder="https://project.demo"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={projectStatus === "loading"}>
                      {projectStatus === "loading"
                        ? "Saving..."
                        : editingProjectId
                          ? "Update Project"
                          : "Create Project"}
                    </Button>
                    {editingProjectId && (
                      <Button type="button" variant="outline" onClick={cancelEditProject}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  {projectStatus === "error" && (
                    <p className="text-xs text-red-400">{projectError}</p>
                  )}
                  {projectStatus === "success" && (
                    <p className="text-xs text-emerald-400">{projectSuccessMessage}</p>
                  )}
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">Existing Projects</p>
                  {projectList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No projects yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectList.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.technologies.join(", ")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => startEditProject(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleProjectDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow" id="certificates-admin">
              <CardHeader>
                <CardTitle>{editingCertificateId ? "Edit Certificate" : "New Certificate"}</CardTitle>
                <CardDescription>
                  Upload certificate media and {editingCertificateId ? "update" : "publish"} it to the portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCertificateSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="cert-title">
                        Title
                      </label>
                      <Input
                        id="cert-title"
                        name="title"
                        value={certificateValues.title}
                        onChange={handleCertificateChange}
                        placeholder="Certificate name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="cert-image">
                        Certificate Image
                      </label>
                      <Input
                        id="cert-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleCertificateFile}
                      />
                      {certificateImagePreview && (
                        <img
                          src={certificateImagePreview}
                          alt="Certificate preview"
                          className="mt-3 h-32 w-full rounded-md border border-border/60 object-cover"
                        />
                      )}
                      {(certificateImagePreview || editingCertificateId) && (
                        <button
                          type="button"
                          className="text-xs text-muted-foreground underline"
                          onClick={() => {
                            setCertificateImage(null);
                            updateCertificatePreview(editingCertificateImageUrl || "", false);
                          }}
                        >
                          Use existing image
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="cert-issuer">
                        Issuer
                      </label>
                      <Input
                        id="cert-issuer"
                        name="issuer"
                        value={certificateValues.issuer}
                        onChange={handleCertificateChange}
                        placeholder="Issuer name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="cert-date">
                        Date
                      </label>
                      <Input
                        id="cert-date"
                        name="date"
                        value={certificateValues.date}
                        onChange={handleCertificateChange}
                        placeholder="Jan 2026"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cert-description">
                      Description
                    </label>
                    <Textarea
                      id="cert-description"
                      name="description"
                      value={certificateValues.description}
                      onChange={handleCertificateChange}
                      placeholder="What the certificate covers"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cert-skills">
                      Skills (comma-separated)
                    </label>
                    <Input
                      id="cert-skills"
                      name="skills"
                      value={certificateValues.skills}
                      onChange={handleCertificateChange}
                      placeholder="Node.js, REST API, MongoDB"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cert-link">
                      Certificate Link
                    </label>
                    <Input
                      id="cert-link"
                      name="link"
                      value={certificateValues.link}
                      onChange={handleCertificateChange}
                      placeholder="https://issuer.example/certificate"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={certificateStatus === "loading"}>
                      {certificateStatus === "loading"
                        ? "Saving..."
                        : editingCertificateId
                          ? "Update Certificate"
                          : "Create Certificate"}
                    </Button>
                    {editingCertificateId && (
                      <Button type="button" variant="outline" onClick={cancelEditCertificate}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  {certificateStatus === "error" && (
                    <p className="text-xs text-red-400">{certificateError}</p>
                  )}
                  {certificateStatus === "success" && (
                    <p className="text-xs text-emerald-400">{certificateSuccessMessage}</p>
                  )}
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">Existing Certificates</p>
                  <p className="text-xs text-muted-foreground">Sorted by last edit.</p>
                  {certificateList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No certificates yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {certificateList.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.issuer}</p>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary underline"
                              >
                                Proof link
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => startEditCertificate(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCertificateDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow" id="hackathons-admin">
              <CardHeader>
                <CardTitle>{editingHackathonId ? "Edit Hackathon" : "New Hackathon"}</CardTitle>
                <CardDescription>Add hackathon highlights for the portfolio.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleHackathonSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="hackathon-title">
                        Title
                      </label>
                      <Input
                        id="hackathon-title"
                        name="title"
                        value={hackathonValues.title}
                        onChange={handleHackathonChange}
                        placeholder="Hackathon name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="hackathon-result">
                        Result
                      </label>
                      <Input
                        id="hackathon-result"
                        name="result"
                        value={hackathonValues.result}
                        onChange={handleHackathonChange}
                        placeholder="Winner, Finalist, 3rd place"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="hackathon-image">
                      Hackathon Image
                    </label>
                    <Input
                      id="hackathon-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleHackathonFile}
                    />
                    {hackathonImagePreview && (
                      <img
                        src={hackathonImagePreview}
                        alt="Hackathon preview"
                        className="mt-3 h-32 w-full rounded-md border border-border/60 object-cover"
                      />
                    )}
                    {(hackathonImagePreview || editingHackathonId) && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline"
                        onClick={() => {
                          setHackathonImage(null);
                          updateHackathonPreview(editingHackathonImageUrl || "", false);
                        }}
                      >
                        Use existing image
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="hackathon-date">
                        Date
                      </label>
                      <Input
                        id="hackathon-date"
                        name="date"
                        value={hackathonValues.date}
                        onChange={handleHackathonChange}
                        placeholder="Feb 2026"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="hackathon-link">
                        Link
                      </label>
                      <Input
                        id="hackathon-link"
                        name="link"
                        value={hackathonValues.link}
                        onChange={handleHackathonChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="hackathon-focus">
                      Focus
                    </label>
                    <Textarea
                      id="hackathon-focus"
                      name="focus"
                      value={hackathonValues.focus}
                      onChange={handleHackathonChange}
                      placeholder="What the team built or focused on"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={hackathonStatus === "loading"}>
                      {hackathonStatus === "loading"
                        ? "Saving..."
                        : editingHackathonId
                          ? "Update Hackathon"
                          : "Create Hackathon"}
                    </Button>
                    {editingHackathonId && (
                      <Button type="button" variant="outline" onClick={cancelEditHackathon}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  {hackathonStatus === "error" && (
                    <p className="text-xs text-red-400">{hackathonError}</p>
                  )}
                  {hackathonStatus === "success" && (
                    <p className="text-xs text-emerald-400">{hackathonSuccessMessage}</p>
                  )}
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">Existing Hackathons</p>
                  {hackathonList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hackathons yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {hackathonList.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.result || item.date}</p>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary underline"
                              >
                                Proof link
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => startEditHackathon(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleHackathonDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>{editingLinkId ? "Edit Link" : "New Link"}</CardTitle>
                <CardDescription>Manage profile and social links.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleLinkSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="link-label">
                        Label
                      </label>
                      <Input
                        id="link-label"
                        name="label"
                        value={linkValues.label}
                        onChange={handleLinkChange}
                        placeholder="GitHub"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="link-category">
                        Category
                      </label>
                      <Input
                        id="link-category"
                        name="category"
                        value={linkValues.category}
                        onChange={handleLinkChange}
                        placeholder="social"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="link-url">
                      URL
                    </label>
                    <Input
                      id="link-url"
                      name="url"
                      value={linkValues.url}
                      onChange={handleLinkChange}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={linkStatus === "loading"}>
                      {linkStatus === "loading"
                        ? "Saving..."
                        : editingLinkId
                          ? "Update Link"
                          : "Create Link"}
                    </Button>
                    {editingLinkId && (
                      <Button type="button" variant="outline" onClick={cancelEditLink}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  {linkStatus === "error" && (
                    <p className="text-xs text-red-400">{linkError}</p>
                  )}
                  {linkStatus === "success" && (
                    <p className="text-xs text-emerald-400">{linkSuccessMessage}</p>
                  )}
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">Existing Links</p>
                  {linkList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No links yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {linkList.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.url}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => startEditLink(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleLinkDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
