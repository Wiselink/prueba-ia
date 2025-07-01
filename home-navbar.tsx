"use client"
import { switchContractedNavbar } from "@/reducers/themeReducer"
import { getCompaniesExpos } from "@/services/onlineExpositions/get"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  MdAccountCircle,
  MdAddBusiness,
  MdAddCircle,
  MdAssessment,
  MdChat,
  MdCollectionsBookmark,
  MdContacts,
  MdCookie,
  MdEvent,
  MdFirstPage,
  MdGroups,
  MdHelp,
  MdHistory,
  MdHomeFilled,
  MdLastPage,
  MdLeaderboard,
  MdMarkAsUnread,
  MdMenuBook,
  MdMultilineChart,
  MdPendingActions,
  MdPeople,
  MdPieChart,
  MdPolicy,
  MdQrCode,
  MdSettings,
  MdStore,
  MdStyle,
  MdSupportAgent,
  MdTextSnippet,
  MdTune,
  MdWork,
} from "react-icons/md"
import { useQuery } from "react-query"
import { useDispatch, useSelector } from "react-redux"
import { usePathname, useRouter } from "src/navigation"
import styled from "styled-components"
import { AttributeTag } from "../atoms/AttributeTag"
import { BoxContainer } from "../atoms/BoxContainer"
import { Divider } from "../atoms/Divider"
import { LogoutButton } from "../atoms/LogoutButton"
import { NavItem } from "../atoms/NavItem"
import { PermissionBox } from "../atoms/PermissionBox"
import { BUTTONS_SIZE } from "../atoms/PrimaryButton"
import PrimaryButtonTextBlue from "../atoms/PrimaryButtonTextBlue"
import { SkeletonBox } from "../atoms/SkeletonBox"
import { TextMini, TextTiny } from "../atoms/Texts"
import TooltipCustom from "../atoms/Tooltip"
import { usePermissions } from "../hooks/usePermissions"
import { NavSidebar } from "../molecules/NavSidebar"
import { PillLabel } from "../molecules/PillLabel"
import { Notifications } from "../organisms/Notifications"
import { ChartsNav } from "../organisms/navs/ChartsNav"
import { CrmNav } from "../organisms/navs/CrmNav"
import { EditionNav } from "../organisms/navs/EditionNav"
import { ExpoOfflineNav } from "../organisms/navs/ExpoOfflineNav"
import { ExpoOnlineNav } from "../organisms/navs/ExpoOnlineNav"

const SubtitlesMenus = styled(TextMini)`
  font-weight: 500;
  color: ${({ theme }) => theme.color_text_3};
`

// Memoized mobile navigation items with company/user logic
const MobileNavItems = memo(({ t, memoizedIcons, notificationsCounter, entityInfo, pathname }) => {
  const { isCompany, isRepresentative, canAccessExpositionFeatures, canAccess, ROLES } = usePermissions()

  if (isCompany) {
    // Company mobile navigation
    return (
      <>
        <Notifications forMobile={true} notCollapsable={true} />

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          <NavItem href={`/my-contact-code`} icon={memoizedIcons.contactCode} largeNavItem={true} notCollapsable={true}>
            {t("contactCode")}
          </NavItem>
        </PermissionBox>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          <NavItem href={`/contact-book`} icon={memoizedIcons.contactBook} notCollapsable={true}>
            {t("contactBook")}
          </NavItem>
        </PermissionBox>

        <NavItem href={`/news`} icon={memoizedIcons.news} notCollapsable={true}>
          {t("news")}
        </NavItem>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          {isRepresentative && (
            <NavItem href={`/my-chats`} isEntity={true} icon={memoizedIcons.chat} notCollapsable={true}>
              <BoxContainer fd="row" gap="7px" ai="center" jc="space-between">
                {t("chat")}
                {notificationsCounter > 0 && (
                  <AttributeTag bg="color_lightblue" padding="3px 6px">
                    {notificationsCounter > 9 ? "9+" : notificationsCounter === 0 ? "" : notificationsCounter}
                  </AttributeTag>
                )}
              </BoxContainer>
            </NavItem>
          )}
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/my-businesses`} isEntity={true} icon={memoizedIcons.business} notCollapsable={true}>
            {t("business")}
          </NavItem>
        </PermissionBox>

        <NavItem
          href={`/company/${entityInfo?.companyToken}/commercial-attention/${
            entityInfo?.address?.editionToken || entityInfo?.address?.token || entityInfo?.address?.id
          }`}
          icon={memoizedIcons.publicAttention}
          largeNavItem={true}
          notCollapsable={true}
        >
          {t("publicAttention")}
        </NavItem>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN]}>
          <NavItem
            href={`/company/${entityInfo.companyToken}/employees`}
            icon={memoizedIcons.employees}
            notCollapsable={true}
          >
            {t("companyStaff")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/historial`} icon={memoizedIcons.historyVisit} notCollapsable={true}>
            {t("historyVisit")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/sync-requests`} icon={memoizedIcons.linkingRequests} notCollapsable={true}>
            {t("linkingRequests")}
          </NavItem>
        </PermissionBox>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          {isRepresentative && (
            <NavItem
              href={`${pathname}?scan-stand=true`}
              icon={memoizedIcons.visitStand}
              largeNavItem={true}
              notCollapsable={true}
            >
              {t("visitStand")}
            </NavItem>
          )}
        </PermissionBox>

        <NavItem href={`/tasks`} icon={memoizedIcons.tasks} notCollapsable={true}>
          {t("tasks")}
        </NavItem>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          <NavItem href={`/calendar`} icon={memoizedIcons.calendar} notCollapsable={true}>
            {t("calendar")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/collected-material`} icon={memoizedIcons.collectedMaterial} notCollapsable={true}>
            {t("collectedMaterial")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem
            href={`/company/${entityInfo.companyToken}/catalog`}
            isEntity={true}
            icon={memoizedIcons.digitalCatalog}
            notCollapsable={true}
          >
            {t("digitalCatalog")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem
            href={`/company/${entityInfo.companyToken}/charts/performanceMetrics`}
            isEntity={true}
            icon={memoizedIcons.businessMetrics}
            notCollapsable={true}
          >
            {t("metricsNav.generalMetrics")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN]}>
          <NavItem
            href={`/company/${entityInfo.companyToken}/charts/businessReport`}
            isEntity={true}
            icon={memoizedIcons.generalMetrics}
            notCollapsable={true}
          >
            {t("metricsNav.business")}
          </NavItem>
        </PermissionBox>

        {canAccessExpositionFeatures && (
          <>
            <NavItem
              href={`/expositions?to=analysis`}
              isEntity={true}
              icon={memoizedIcons.analysis}
              tooltipText={t("analysis")}
            >
              {t("analysis")}
            </NavItem>

            <NavItem
              href={`/expositions?to=metrics`}
              isEntity={true}
              icon={memoizedIcons.expoMetrics}
              tooltipText={t("expoMetrics")}
            >
              {t("expoMetrics")}
            </NavItem>
          </>
        )}

        <Divider />

        <NavItem href="/helpAndSupport" icon={memoizedIcons.help} largeNavItem={true} notCollapsable={true}>
          {t("help")}
        </NavItem>

        <NavItem
          href="/user/user-configuration"
          icon={memoizedIcons.accountConfig}
          largeNavItem={true}
          notCollapsable={true}
        >
          {t("accountConfig")}
        </NavItem>

        <NavItem href="/user/cookies" icon={memoizedIcons.cookiesConfig} notCollapsable={true}>
          {t("cookiesConfig")}
        </NavItem>

        <NavItem href="/user/terms-and-conditions" icon={memoizedIcons.termsAndConditions} notCollapsable={true}>
          {t("termsAndConditions")}
        </NavItem>

        <NavItem href="/user/privacy" icon={memoizedIcons.privacyPolicy} notCollapsable={true}>
          {t("privacyPolicy")}
        </NavItem>

        <Divider />

        <div className="w-full p-[7px] flex flex-col items-stretch mt-auto">
          <LogoutButton />
        </div>
      </>
    )
  } else {
    // Non-company (user) mobile navigation
    return (
      <>
        <Notifications notCollapsable={true} forMobile={true} />

        <NavItem href={`/my-contact-code`} icon={memoizedIcons.contactCode} largeNavItem={true} notCollapsable={true}>
          {t("contactCode")}
        </NavItem>

        <NavItem href={`/contact-book`} isEntity={true} icon={memoizedIcons.contactBook} notCollapsable={true}>
          {t("contactBook")}
        </NavItem>

        <NavItem href={`/news`} icon={memoizedIcons.news} notCollapsable={true}>
          {t("news")}
        </NavItem>

        <NavItem href={`/my-businesses`} isEntity={true} icon={memoizedIcons.business} notCollapsable={true}>
          {t("business")}
        </NavItem>

        <NavItem href={`/my-chats`} isEntity={true} icon={memoizedIcons.chat} notCollapsable={true}>
          <BoxContainer fd="row" gap="7px" ai="center" jc="space-between">
            {t("chat")}
            {notificationsCounter > 0 && (
              <AttributeTag bg="color_lightblue">
                {notificationsCounter > 9 ? "9+" : notificationsCounter === 0 ? "" : notificationsCounter}
              </AttributeTag>
            )}
          </BoxContainer>
        </NavItem>

        <NavItem href={`/historial`} icon={memoizedIcons.historyVisit} notCollapsable={true}>
          {t("historyVisit")}
        </NavItem>

        <NavItem href={`/sync-requests`} icon={memoizedIcons.linkingRequests} notCollapsable={true}>
          {t("syncRequest")}
        </NavItem>

        <NavItem href={`/tasks`} isEntity={true} icon={memoizedIcons.tasks} notCollapsable={true}>
          {t("tasks")}
        </NavItem>

        <NavItem href={`/calendar`} icon={memoizedIcons.calendar} isEntity={true} notCollapsable={true}>
          {t("calendar")}
        </NavItem>

        <NavItem
          href={`${pathname}?scan-stand=true`}
          icon={memoizedIcons.visitStand}
          largeNavItem={true}
          notCollapsable={true}
        >
          {t("visitStand")}
        </NavItem>

        <NavItem href={`/collected-material`} icon={memoizedIcons.collectedMaterial} notCollapsable={true}>
          {t("colletedMaterial")}
        </NavItem>

        <NavItem href="/create-company" icon={memoizedIcons.createExposition} tooltipText={t("createCompany")}>
          {t("createCompany")}
        </NavItem>

        <Divider />

        <NavItem href="/user/cookies" icon={memoizedIcons.cookiesConfig} notCollapsable={true}>
          {t("cookiesConfig")}
        </NavItem>

        <NavItem href="/user/terms-and-conditions" icon={memoizedIcons.termsAndConditions} notCollapsable={true}>
          {t("termsAndConditions")}
        </NavItem>

        <NavItem href="/user/privacy" icon={memoizedIcons.privacyPolicy} notCollapsable={true}>
          {t("privacyPolicy")}
        </NavItem>

        <NavItem href="/helpAndSupport" icon={memoizedIcons.help} largeNavItem={true} notCollapsable={true}>
          {t("help")}
        </NavItem>

        <NavItem
          href="/user/user-configuration"
          icon={memoizedIcons.accountConfig}
          largeNavItem={true}
          notCollapsable={true}
        >
          {t("companyConfig")}
        </NavItem>

        <Divider />

        <div className="w-full p-[7px] flex flex-col items-stretch">
          <LogoutButton />
        </div>
      </>
    )
  }
})

MobileNavItems.displayName = "MobileNavItems"

// Memoized desktop navigation items with company/user logic
const DesktopNavItems = memo(({ t, memoizedIcons, notificationsCounter, entityInfo }) => {
  const { isCompany, isRepresentative, canAccess, ROLES } = usePermissions()

  if (isCompany) {
    // Company desktop navigation
    return (
      <>
        <NavItem href={`/contact-book`} isEntity={true} icon={memoizedIcons.contactBook} tooltipText={t("contactBook")}>
          {t("contactBook")}
        </NavItem>

        <NavItem href={`/my-businesses`} isEntity={true} icon={memoizedIcons.business} tooltipText={t("business")}>
          {t("business")}
        </NavItem>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          {isRepresentative && (
            <NavItem href="/my-chats" icon={memoizedIcons.chat} tooltipText={t("chat")}>
              <BoxContainer fd="row" gap="7px" ai="center" jc="space-between">
                {t("chat")}
                {notificationsCounter > 0 && (
                  <AttributeTag bg="color_lightblue" padding="3px 6px">
                    {notificationsCounter > 9 ? "9+" : notificationsCounter === 0 ? "" : notificationsCounter}
                  </AttributeTag>
                )}
              </BoxContainer>
            </NavItem>
          )}
        </PermissionBox>

        <NavItem href={`/tasks`} icon={memoizedIcons.tasks} tooltipText={t("tasks")}>
          {t("tasks")}
        </NavItem>

        <PermissionBox
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER, ROLES.ADMINISTRATIVE_STAFF]}
        >
          <NavItem href={`/calendar`} icon={memoizedIcons.calendar} tooltipText={t("calendar")}>
            {t("calendar")}
          </NavItem>
        </PermissionBox>

        <NavItem href={`/meetings`} icon={memoizedIcons.people} tooltipText={t("meetings")}>
          {t("meetings")}
        </NavItem>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem
            href={`/collected-material`}
            icon={memoizedIcons.collectedMaterial}
            tooltipText={t("collectedMaterial")}
          >
            {t("collectedMaterial")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/historial`} icon={memoizedIcons.historyVisit} tooltipText={t("historyVisit")}>
            {t("historyVisit")}
          </NavItem>
        </PermissionBox>

        <PermissionBox allowedRoles={[ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN, ROLES.SELLER]}>
          <NavItem href={`/sync-requests`} icon={memoizedIcons.linkingRequests} tooltipText={t("syncRequest")}>
            {t("syncRequest")}
          </NavItem>
        </PermissionBox>
      </>
    )
  } else {
    // Non-company (user) desktop navigation
    return (
      <>
        <NavItem href={`/contact-book`} icon={memoizedIcons.contactBook} tooltipText={t("contactBook")}>
          {t("contactBook")}
        </NavItem>

        <NavItem href={`/my-businesses`} isEntity={true} icon={memoizedIcons.business} tooltipText={t("business")}>
          {t("business")}
        </NavItem>

        <NavItem href="/my-chats" icon={memoizedIcons.chat} jc="space-between" tooltipText={t("chat")}>
          <BoxContainer fd="row" gap="7px" ai="center" jc="space-between">
            {t("chat")}
            {notificationsCounter > 0 && (
              <AttributeTag bg="color_lightblue">
                {notificationsCounter > 9 ? "9+" : notificationsCounter === 0 ? "" : notificationsCounter}
              </AttributeTag>
            )}
          </BoxContainer>
        </NavItem>

        <NavItem href={`/tasks`} icon={memoizedIcons.tasks} tooltipText={t("tasks")}>
          {t("tasks")}
        </NavItem>

        <NavItem href={`/calendar`} icon={memoizedIcons.calendar} tooltipText={t("calendar")}>
          {t("calendar")}
        </NavItem>

        <NavItem href={`/meetings`} icon={memoizedIcons.people} tooltipText={t("meetings")}>
          {t("meetings")}
        </NavItem>

        <NavItem
          href={`/collected-material`}
          icon={memoizedIcons.collectedMaterial}
          tooltipText={t("colletedMaterial")}
        >
          {t("colletedMaterial")}
        </NavItem>

        <NavItem href={`/historial`} icon={memoizedIcons.historyVisit} tooltipText={t("historyVisit")}>
          {t("historyVisit")}
        </NavItem>

        <NavItem href={`/sync-requests`} icon={memoizedIcons.linkingRequests} tooltipText={t("syncRequest")}>
          {t("syncRequest")}
        </NavItem>
      </>
    )
  }
})

DesktopNavItems.displayName = "DesktopNavItems"

// Memoized company nav items
const CompanyNavItems = memo(({ t, memoizedIcons, entityInfo }) => (
  <BoxContainer padding="5px" gap="0">
    <NavItem
      href={`/company/${entityInfo.companyToken}/configuration`}
      isEntity={true}
      icon={memoizedIcons.settings}
      tooltipText={t("companyConfig")}
    >
      {t("companyConfig")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/employees`}
      isEntity={true}
      icon={memoizedIcons.employees}
      tooltipText={t("companyStaff")}
    >
      {t("companyStaff")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/catalog`}
      isEntity={true}
      icon={memoizedIcons.digitalCatalog}
      tooltipText={t("digitalCatalog")}
    >
      {t("digitalCatalog")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/commercial-attention-dashboards`}
      isEntity={true}
      icon={memoizedIcons.publicAttention}
      tooltipText={t("publicAttention")}
    >
      {t("publicAttention")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/charts/introduction`}
      isEntity={true}
      icon={memoizedIcons.businessMetrics}
      isSubMenu={true}
      tooltipText={t("metrics")}
    >
      {t("metrics")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/crm/introduction`}
      isEntity={true}
      isSubMenu={true}
      icon={memoizedIcons.configCrm}
      tooltipText={t("configCrm")}
    >
      {t("configCrm")}
    </NavItem>

    <NavItem
      href={`/company/${entityInfo.companyToken}/expo-management`}
      isEntity={true}
      icon={memoizedIcons.exhibitorManagement}
      tooltipText={t("exhibitorManagement")}
    >
      {t("exhibitorManagement")}
    </NavItem>
  </BoxContainer>
))

CompanyNavItems.displayName = "CompanyNavItems"

// Memoized expositions list
const ExpositionsList = memo(({ companiesExpos, isLoading, isSuccess, t, navbarContracted }) => (
  <BoxContainer padding="0 5px 20px 5px " gap="0">
    {isLoading && (
      <BoxContainer gap="5px" padding="0 12px">
        <SkeletonBox height="30px" />
        <SkeletonBox height="30px" />
        <SkeletonBox height="30px" />
      </BoxContainer>
    )}
    {isSuccess &&
      companiesExpos?.map((expo) => (
        <NavItem
          href={`/expositions/${expo?.id}`}
          key={expo?.id}
          isEntity={true}
          isSubMenu={true}
          iconImage={expo?.logo}
          withCropOf={1}
          tooltipText={expo?.name}
        >
          {expo?.name}
        </NavItem>
      ))}

    <NavItem
      href={`/create-exposition`}
      isEntity={true}
      icon={<MdAddCircle />}
      tooltipText={
        <div className="flex items-center gap-[5px]">
          Crear exposición
          <PillLabel bg="color_lightblue" padding="2px 6px 2px 6px">
            <TextTiny>
              <strong className="!text-text_white">NUEVO</strong>
            </TextTiny>
          </PillLabel>
        </div>
      }
      isNewIcon={!navbarContracted && true}
    >
      Crear exposición
    </NavItem>
  </BoxContainer>
))

ExpositionsList.displayName = "ExpositionsList"

const HomeNavbar = memo(({ forHamburger, ...props }) => {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const t = useTranslations("navBar")
  const dispatch = useDispatch()

  // Selectors
  const loggedUser = useSelector((value) => value.user)
  const entityInfo = useSelector((state) => state.entity)
  const messages = useSelector((state) => state.chatPanel)
  const navbarContracted = useSelector((state) => state.theme.contractedNavbar)
  const companySteps = useSelector((state) => state.companySteps)

  // Custom hooks
  const { isCompany, canAccessExpositionFeatures } = usePermissions()

  // State
  const [nav, setNav] = useState({
    id: "",
    element: null,
  })

  const [notificationsCounter, setNotificationsCounter] = useState(0)
  const firstRender = useRef(true)

  // Data fetching with React Query
  const {
    data: companiesExpos,
    isLoading,
    isSuccess,
  } = useQuery(["companiesExpos", loggedUser?.token, entityInfo?.companyToken], () => getCompaniesExpos(), {
    staleTime: 1000 * 60 * 5,
    enabled: !!entityInfo?.isExpositionOrganizer && canAccessExpositionFeatures,
  })

  // Memoized values
  const memoizedIcons = useMemo(
    () => ({
      home: <MdHomeFilled />,
      contactCode: <MdQrCode size={24} />,
      contactBook: <MdContacts />,
      news: <MdMenuBook />,
      chat: <MdChat />,
      business: <MdWork />,
      publicAttention: <MdSupportAgent />,
      historyVisit: <MdHistory />,
      linkingRequests: <MdMarkAsUnread />,
      visitStand: <MdAddBusiness size={24} />,
      tasks: <MdPendingActions />,
      calendar: <MdEvent />,
      collectedMaterial: <MdCollectionsBookmark />,
      digitalCatalog: <MdStyle />,
      generalMetrics: <MdLeaderboard />,
      businessMetrics: <MdMultilineChart />,
      analysis: <MdPieChart />,
      expoMetrics: <MdLeaderboard />,
      help: <MdHelp />,
      accountConfig: <MdAccountCircle />,
      cookiesConfig: <MdCookie />,
      termsAndConditions: <MdTextSnippet />,
      privacyPolicy: <MdPolicy />,
      settings: <MdSettings />,
      employees: <MdGroups />,
      configCrm: <MdTune />,
      exhibitorManagement: <MdStore />,
      people: <MdPeople />,
      createExposition: <MdAddCircle />,
      introductionCharts: <MdAssessment />,
    }),
    [],
  )

  // Handle first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    }
  }, [entityInfo?.companyToken])

  // Calculate notifications counter
  useEffect(() => {
    if (messages?.length > 0) {
      let counter = 0
      messages.forEach((message) => {
        counter += message?.participants[entityInfo?.employeeToken || loggedUser?.token]?.messagesToRead > 0 ? 1 : 0
      })
      setNotificationsCounter(counter)
    }
  }, [messages, entityInfo?.employeeToken, loggedUser?.token])

  // Handle navigation changes
  useEffect(() => {
    if (!router || !pathname) return

    const determineNavigation = () => {
      if (pathname.includes("crm")) {
        return { id: "crmNav", element: <CrmNav /> }
      }

      if (pathname.includes("expo-management/") && !pathname.includes("new-offline-expo")) {
        return { id: "expoOfflineNav", element: <ExpoOfflineNav {...props} /> }
      }

      if (params.editionToken) {
        return { id: "editionNav", element: <EditionNav {...props} /> }
      }

      if (pathname.includes("/expositions")) {
        return { id: "expoOnlineNav", element: <ExpoOnlineNav {...props} /> }
      }

      if (pathname.includes("/charts")) {
        return { id: "chartsNav", element: <ChartsNav {...props} /> }
      }

      return { id: "", element: null }
    }

    const newNav = determineNavigation()
    if (nav.id !== newNav.id) {
      setNav(newNav)
    }
  }, [pathname, params.editionToken, router, nav.id])

  // Handle navbar toggle
  const handleToggleNavbar = useCallback(() => {
    dispatch(switchContractedNavbar())
  }, [dispatch])

  return (
    <NavSidebar withPadding={!forHamburger}>
      {pathname && (
        <>
          {nav?.element || (
            <BoxContainer gap="0px">
              <BoxContainer padding="5px" gap="0">
                <NavItem
                  href="/home"
                  isEntity={true}
                  icon={memoizedIcons.home}
                  tooltipText={t("home")}
                  notCollapsable={forHamburger}
                >
                  {t("home")}
                </NavItem>

                {forHamburger ? (
                  <MobileNavItems
                    t={t}
                    memoizedIcons={memoizedIcons}
                    notificationsCounter={notificationsCounter}
                    entityInfo={entityInfo}
                    pathname={pathname}
                  />
                ) : (
                  <DesktopNavItems
                    t={t}
                    memoizedIcons={memoizedIcons}
                    notificationsCounter={notificationsCounter}
                    entityInfo={entityInfo}
                  />
                )}
              </BoxContainer>

              {/* Company-specific sections for desktop */}
              {!forHamburger && isCompany && (
                <>
                  <Divider />
                  {!navbarContracted && (
                    <BoxContainer padding="20px 10px 5px 20px">
                      <SubtitlesMenus>{t("myCompany")}</SubtitlesMenus>
                    </BoxContainer>
                  )}

                  <CompanyNavItems t={t} memoizedIcons={memoizedIcons} entityInfo={entityInfo} />

                  {entityInfo?.isExpositionOrganizer && canAccessExpositionFeatures && (
                    <>
                      {!navbarContracted && (
                        <>
                          <Divider />
                          <BoxContainer padding="20px 10px 5px 20px">
                            <SubtitlesMenus>EXPOSICIONES</SubtitlesMenus>
                          </BoxContainer>
                        </>
                      )}

                      <ExpositionsList
                        companiesExpos={companiesExpos}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        t={t}
                        navbarContracted={navbarContracted}
                      />
                    </>
                  )}
                </>
              )}

              {/* Non-company create company section for desktop */}
              {!forHamburger && !isCompany && (
                <>
                  <Divider />
                  <BoxContainer padding="5px">
                    <NavItem
                      href="/create-company"
                      icon={memoizedIcons.createExposition}
                      tooltipText={t("createCompany")}
                    >
                      {t("createCompany")}
                    </NavItem>
                  </BoxContainer>
                </>
              )}
            </BoxContainer>
          )}
        </>
      )}

      {!forHamburger && !Object.values(companySteps)?.some((step) => !step) && (
        <>
          <Divider />
          <TooltipCustom text={navbarContracted ? t("expand") : t("contraction")} aboveRight={true}>
            <BoxContainer ai="stretch">
              <PrimaryButtonTextBlue
                onClick={handleToggleNavbar}
                size={BUTTONS_SIZE.LARGE}
                br="0px"
                icon={navbarContracted ? <MdLastPage /> : <MdFirstPage />}
              />
            </BoxContainer>
          </TooltipCustom>
        </>
      )}
    </NavSidebar>
  )
})

HomeNavbar.displayName = "HomeNavbar"

export default HomeNavbar
