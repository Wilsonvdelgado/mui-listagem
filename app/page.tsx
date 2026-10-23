"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

type ApplicationStatus = "Enviada" | "Em análise" | "Entrevista" | "Recusada";
type FilterStatus = "Todas" | "Em andamento" | "Entrevista" | "Encerradas";

type Application = {
  id: number;
  company: string;
  role: string;
  location: string;
  date: string;
  status: ApplicationStatus;
  initials: string;
  color: string;
};

const initialApplications: Application[] = [
  { id: 1, company: "Nubank", role: "Product Designer", location: "São Paulo, SP", date: "18 jun, 2025", status: "Entrevista", initials: "N", color: "#820ad1" },
  { id: 2, company: "iFood", role: "UX Designer Pleno", location: "Remoto", date: "16 jun, 2025", status: "Em análise", initials: "iF", color: "#ea1d2c" },
  { id: 3, company: "Loft", role: "Product Designer", location: "São Paulo, SP", date: "14 jun, 2025", status: "Enviada", initials: "L", color: "#3447a5" },
  { id: 4, company: "Stone", role: "UX Researcher", location: "Rio de Janeiro, RJ", date: "12 jun, 2025", status: "Entrevista", initials: "S", color: "#00a868" },
  { id: 5, company: "QuintoAndar", role: "Product Designer Sr.", location: "Remoto", date: "10 jun, 2025", status: "Em análise", initials: "Q", color: "#5426c5" },
  { id: 6, company: "Mercado Livre", role: "Designer de Produto", location: "Osasco, SP", date: "06 jun, 2025", status: "Recusada", initials: "M", color: "#ffe600" },
  { id: 7, company: "Gympass", role: "Product Designer", location: "Remoto", date: "03 jun, 2025", status: "Enviada", initials: "G", color: "#191919" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#6457e8", dark: "#5043d3", light: "#f0efff" },
    background: { default: "#f7f8fc", paper: "#ffffff" },
    text: { primary: "#202136", secondary: "#85869a" },
    success: { main: "#178b63" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
});

const filterOptions: FilterStatus[] = ["Todas", "Em andamento", "Entrevista", "Encerradas"];

function statusColor(status: ApplicationStatus) {
  switch (status) {
    case "Entrevista":
      return { color: "#6954d8", backgroundColor: "#f0edff" };
    case "Em análise":
      return { color: "#b27717", backgroundColor: "#fff6e5" };
    case "Recusada":
      return { color: "#bd5460", backgroundColor: "#fff0f1" };
    default:
      return { color: "#43826b", backgroundColor: "#eaf7f1" };
  }
}

export default function Home() {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<FilterStatus>("Todas");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return applications.filter((application) => {
      const matchesQuery = `${application.company} ${application.role} ${application.location}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedQuery);
      const matchesFilter =
        filter === "Todas" ||
        (filter === "Em andamento" && ["Enviada", "Em análise"].includes(application.status)) ||
        (filter === "Entrevista" && application.status === "Entrevista") ||
        (filter === "Encerradas" && application.status === "Recusada");
      return matchesQuery && matchesFilter;
    });
  }, [applications, filter, query]);

  const handleFilterChange = (nextFilter: FilterStatus) => {
    setFilter(nextFilter);
    setPage(0);
  };

  const handleAddApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCompany = company.trim();
    const newRole = role.trim();
    const newLocation = location.trim();
    if (!newCompany || !newRole || !newLocation) return;

    setApplications((current) => [
      {
        id: Date.now(),
        company: newCompany,
        role: newRole,
        location: newLocation,
        date: "Hoje",
        status: "Enviada",
        initials: newCompany.slice(0, 2).toUpperCase(),
        color: "#6457e8",
      },
      ...current,
    ]);
    setCompany("");
    setRole("");
    setLocation("");
    setFilter("Todas");
    setQuery("");
    setPage(0);
    setDialogOpen(false);
    setNoticeOpen(true);
  };

  const totalInProgress = applications.filter((item) =>
    ["Enviada", "Em análise"].includes(item.status),
  ).length;
  const interviewCount = applications.filter((item) => item.status === "Entrevista").length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
        <Box
          component="aside"
          sx={{
            width: 248,
            flexShrink: 0,
            bgcolor: "#fff",
            borderRight: "1px solid #ececf3",
            px: 2.5,
            py: 3,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1, mb: 5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "11px", bgcolor: "primary.main", display: "grid", placeItems: "center", color: "#fff" }}>
              <WorkOutlineRoundedIcon fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px" }}>
              trilha<span style={{ color: "#6457e8" }}>.</span>
            </Typography>
          </Box>

          <Typography sx={{ px: 1.5, mb: 1.2, color: "#a1a2b3", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px" }}>
            MENU PRINCIPAL
          </Typography>
          <Button
            startIcon={<DashboardOutlinedIcon />}
            sx={{ justifyContent: "flex-start", color: "#77788d", px: 1.5, py: 1.2, mb: 0.5 }}
          >
            Visão geral
          </Button>
          <Button
            startIcon={<DescriptionOutlinedIcon />}
            sx={{
              justifyContent: "flex-start",
              color: "primary.main",
              bgcolor: "primary.light",
              px: 1.5,
              py: 1.2,
              "&:hover": { bgcolor: "primary.light" },
            }}
          >
            Candidaturas
          </Button>

          <Paper
            elevation={0}
            sx={{ mt: "auto", p: 2, bgcolor: "#f8f7ff", border: "1px solid #eeecff" }}
          >
            <Box sx={{ width: 32, height: 32, borderRadius: "10px", display: "grid", placeItems: "center", color: "primary.main", bgcolor: "#e9e6ff", mb: 1.3 }}>
              <TrendingUpRoundedIcon fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>Um passo de cada vez</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 12, lineHeight: 1.6 }}>
              Acompanhe seu progresso e mantenha o foco na próxima oportunidade.
            </Typography>
          </Paper>
        </Box>

        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="header"
            sx={{
              height: 72,
              bgcolor: "#fff",
              borderBottom: "1px solid #ececf3",
              px: { xs: 2.5, md: 5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Espaço de trabalho <span style={{ margin: "0 8px", color: "#c4c4cf" }}>/</span>
              <strong style={{ color: "#37384d", fontWeight: 600 }}>Candidaturas</strong>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton aria-label="Notificações" sx={{ color: "#77788d" }}>
                <NotificationsNoneRoundedIcon />
              </IconButton>
              <Avatar sx={{ width: 34, height: 34, bgcolor: "#e9e6ff", color: "primary.main", fontSize: 13, fontWeight: 700 }}>
                MA
              </Avatar>
            </Box>
          </Box>

          <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 } }}>
            <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3.5 }}>
              <Box>
                <Typography component="h1" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 750, letterSpacing: "-0.8px", mb: 0.6 }}>
                  Minhas candidaturas
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                  Organize sua busca e acompanhe cada oportunidade.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ px: 2.2, py: 1.2, boxShadow: "0 5px 14px rgba(100,87,232,.19)" }}
              >
                Nova candidatura
              </Button>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3.5 }}>
              {[
                { title: "Total de candidaturas", value: applications.length, icon: <DescriptionOutlinedIcon />, accent: "#6457e8", bg: "#f0efff" },
                { title: "Em andamento", value: totalInProgress, icon: <BusinessCenterOutlinedIcon />, accent: "#269978", bg: "#eaf7f1" },
                { title: "Entrevistas", value: interviewCount, icon: <CalendarTodayOutlinedIcon />, accent: "#d69a38", bg: "#fff5e4" },
              ].map((stat) => (
                <Paper key={stat.title} elevation={0} sx={{ p: 2.5, border: "1px solid #ececf3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ color: "text.secondary", fontSize: 12.5, mb: 1 }}>{stat.title}</Typography>
                    <Typography sx={{ fontSize: 26, fontWeight: 750, lineHeight: 1 }}>{stat.value}</Typography>
                  </Box>
                  <Box sx={{ width: 44, height: 44, borderRadius: "13px", bgcolor: stat.bg, color: stat.accent, display: "grid", placeItems: "center" }}>
                    {stat.icon}
                  </Box>
                </Paper>
              ))}
            </Box>

            <Paper elevation={0} sx={{ border: "1px solid #ececf3", overflow: "hidden" }}>
              <Box sx={{ px: { xs: 2, md: 2.5 }, pt: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.3 }}>Todas as vagas</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>Suas oportunidades em um só lugar</Typography>
                </Box>
                <TextField
                  size="small"
                  placeholder="Buscar vaga ou empresa"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(0);
                  }}
                  slotProps={{
                    htmlInput: { "aria-label": "Buscar vaga ou empresa" },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ color: "#a1a2b3", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ width: { xs: "100%", sm: 260 }, "& .MuiOutlinedInput-root": { bgcolor: "#fff", fontSize: 13 } }}
                />
              </Box>

              <Box sx={{ px: { xs: 2, md: 2.5 }, pt: 2.2, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <FilterListRoundedIcon sx={{ color: "#9293a5", fontSize: 19, mr: 0.3 }} />
                {filterOptions.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onClick={() => handleFilterChange(option)}
                    variant={filter === option ? "filled" : "outlined"}
                    sx={{
                      height: 31,
                      fontSize: 12,
                      fontWeight: filter === option ? 600 : 500,
                      color: filter === option ? "#fff" : "#77788d",
                      bgcolor: filter === option ? "primary.main" : "transparent",
                      borderColor: "#e7e7ef",
                      "&:hover": { bgcolor: filter === option ? "primary.dark" : "#f8f8fb" },
                    }}
                  />
                ))}
                <Typography sx={{ ml: "auto", color: "text.secondary", fontSize: 12 }}>
                  {filteredApplications.length} {filteredApplications.length === 1 ? "resultado" : "resultados"}
                </Typography>
              </Box>

              <TableContainer sx={{ mt: 1.5, overflowX: "auto" }}>
                <Table sx={{ minWidth: 760 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#fafafd" }}>
                      {["EMPRESA / VAGA", "LOCALIZAÇÃO", "DATA DA CANDIDATURA", "STATUS", ""].map((heading) => (
                        <TableCell key={heading} sx={{ py: 1.4, borderColor: "#f0f0f5", color: "#999aab", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px" }}>
                          {heading}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications
                      .slice(page * 5, page * 5 + 5)
                      .map((application) => (
                        <TableRow key={application.id} hover>
                          <TableCell sx={{ py: 1.8, borderColor: "#f0f0f5" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 38,
                                  height: 38,
                                  bgcolor: application.color,
                                  color: application.company === "Mercado Livre" ? "#242424" : "#fff",
                                  fontWeight: 700,
                                  fontSize: 13,
                                }}
                              >
                                {application.initials}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: 13, fontWeight: 650, lineHeight: 1.4 }}>{application.company}</Typography>
                                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>{application.role}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#67687c", fontSize: 12.5, borderColor: "#f0f0f5" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                              <LocationOnOutlinedIcon sx={{ color: "#a1a2b3", fontSize: 17 }} />
                              {application.location}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#67687c", fontSize: 12.5, borderColor: "#f0f0f5" }}>
                            {application.date}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#f0f0f5" }}>
                            <Chip
                              label={application.status}
                              size="small"
                              sx={{ ...statusColor(application.status), height: 25, fontSize: 11, fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ borderColor: "#f0f0f5" }}>
                            <IconButton aria-label={`Mais opções para ${application.company}`} size="small" sx={{ color: "#a1a2b3" }}>
                              <MoreHorizRoundedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredApplications.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ py: 7, textAlign: "center", borderColor: "#f0f0f5" }}>
                          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Nenhuma candidatura encontrada</Typography>
                          <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                            Tente mudar os filtros ou o termo da busca.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredApplications.length}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={5}
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                sx={{ borderTop: "1px solid #f0f0f5", color: "text.secondary", fontSize: 12 }}
              />
            </Paper>

            <Button
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ display: "flex", mx: "auto", mt: 2, color: "text.secondary", fontSize: 12 }}
            >
              Dica: mantenha suas informações sempre atualizadas
            </Button>
          </Box>
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
          <Box component="form" onSubmit={handleAddApplication}>
            <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Nova candidatura</DialogTitle>
            <DialogContent sx={{ pt: "12px !important", display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 0.5 }}>
                Registre uma oportunidade para acompanhar seu processo.
              </Typography>
              <TextField autoFocus required label="Empresa" value={company} onChange={(event) => setCompany(event.target.value)} />
              <TextField required label="Nome da vaga" value={role} onChange={(event) => setRole(event.target.value)} />
              <TextField required label="Localização" value={location} onChange={(event) => setLocation(event.target.value)} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setDialogOpen(false)} color="inherit">Cancelar</Button>
              <Button type="submit" variant="contained">Adicionar candidatura</Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Snackbar open={noticeOpen} autoHideDuration={3500} onClose={() => setNoticeOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={() => setNoticeOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
            Candidatura adicionada com sucesso.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
