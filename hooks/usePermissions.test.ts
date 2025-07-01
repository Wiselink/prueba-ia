import { renderHook } from "@testing-library/react-hooks"
import { usePermissions } from "./usePermissions"
import { useSelector } from "react-redux"
import useUserRepresents from "./useUserRepresents"
import useUserRole from "./useUserRole"
import { ROLES } from "@/assets/permissionTypes"

// Mock the hooks and Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}))

jest.mock("./useUserRepresents", () => jest.fn())
jest.mock("./useUserRole", () => jest.fn())

describe("usePermissions", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
  })

  it("should detect company entity correctly", () => {
    // Mock Redux state
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      // Simulate the entity state
      return {
        companyToken: "company-123",
        isOutCompany: false,
      }
    })

    // Mock other hooks
    ;(useUserRepresents as jest.Mock).mockReturnValue(true)
    ;(useUserRole as jest.Mock).mockReturnValue(true)

    const { result } = renderHook(() => usePermissions())

    // Check if isCompany is true
    expect(result.current.isCompany).toBe(true)
  })

  it("should detect non-company entity correctly", () => {
    // Mock Redux state for non-company
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      // Simulate the entity state without company token
      return {
        companyToken: null,
      }
    })

    const { result } = renderHook(() => usePermissions())

    // Check if isCompany is false
    expect(result.current.isCompany).toBe(false)
  })

  it("should check exposition features access correctly", () => {
    // Mock Redux state for exposition organizer
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      return {
        isExpositionOrganizer: true,
      }
    })

    // Mock admin role
    ;(useUserRole as jest.Mock).mockReturnValue(true)

    const { result } = renderHook(() => usePermissions())

    // Check if canAccessExpositionFeatures is true
    expect(result.current.canAccessExpositionFeatures).toBe(true)
  })

  it("should check feature access correctly", () => {
    // Mock admin role
    ;(useUserRole as jest.Mock).mockImplementation((roles) => {
      // Return true if checking for SUPER_ADMIN
      return roles.includes(ROLES.SUPER_ADMIN)
    })

    const { result } = renderHook(() => usePermissions())

    // Check specific feature access
    expect(result.current.canAccess("companyStaff")).toBe(true)
    expect(result.current.canAccess("business")).toBe(true)
  })

  it("should check action permissions correctly", () => {
    // Mock admin role
    ;(useUserRole as jest.Mock).mockImplementation((roles) => {
      // Return true if checking for SUPER_ADMIN
      return roles.includes(ROLES.SUPER_ADMIN)
    })

    const { result } = renderHook(() => usePermissions())

    // Check specific action permissions
    expect(result.current.canPerform("manageEmployees")).toBe(true)
    expect(result.current.canPerform("editCompanySettings")).toBe(true)
  })
})
