"use client"

import { ROLES } from "@/assets/permissionTypes"
import useUserRepresents from "@/hooks/useUserRepresents"
import useUserRole from "@/hooks/useUserRole"
import { useSelector } from "react-redux"
import { useMemo } from "react"

/**
 * Hook personalizado que centraliza la lógica de permisos de la aplicación
 * Proporciona métodos para verificar diferentes tipos de permisos basados en roles y estado de la entidad
 */
export function usePermissions() {
  // Obtener información de la entidad del estado global
  const entityInfo = useSelector((state) => state.entity)

  // Utilizar los hooks existentes
  const isRepresentative = useUserRepresents([ROLES.CONTACT_ADMIN, ROLES.SUPER_ADMIN, ROLES.SELLER])
  const isAdminOrContactAdmin = useUserRole([ROLES.SUPER_ADMIN, ROLES.CONTACT_ADMIN])
  const isSuperAdmin = useUserRole([ROLES.SUPER_ADMIN])
  const isContactAdmin = useUserRole([ROLES.CONTACT_ADMIN])
  const isSeller = useUserRole([ROLES.SELLER])
  const isAdminStaff = useUserRole([ROLES.ADMINISTRATIVE_STAFF])

  // Verificar si la entidad actual es una empresa
  const isCompany = entityInfo?.companyToken && !entityInfo?.isOutCompany

  // Verificar si el usuario puede acceder a funciones de exposición
  const canAccessExpositionFeatures = isAdminOrContactAdmin && entityInfo?.isExpositionOrganizer

  /**
   * Verifica si el usuario tiene permiso para acceder a una característica específica
   * @param {string} feature Nombre de la característica a verificar
   * @returns {boolean} true si el usuario tiene permiso para acceder a la característica
   */
  const canAccess = useMemo(() => {
    return (feature) => {
      switch (feature) {
        case "contactCode":
        case "contactBook":
        case "chat":
        case "calendar":
        case "visitStand":
          return isSuperAdmin || isContactAdmin || isSeller || isAdminStaff

        case "business":
        case "historyVisit":
        case "linkingRequests":
        case "collectedMaterial":
        case "digitalCatalog":
        case "businessMetrics":
          return isSuperAdmin || isContactAdmin || isSeller

        case "companyStaff":
        case "generalMetrics":
          return isSuperAdmin || isContactAdmin

        case "analysis":
        case "expoMetrics":
          return isAdminOrContactAdmin && entityInfo?.isExpositionOrganizer

        case "createExposition":
          return isAdminOrContactAdmin && entityInfo?.isExpositionOrganizer

        default:
          return true // Por defecto, permitir acceso si no se especifica una característica
      }
    }
  }, [isAdminOrContactAdmin, entityInfo?.isExpositionOrganizer, isSuperAdmin, isContactAdmin, isSeller, isAdminStaff])

  return {
    // Roles básicos
    isRepresentative,
    isAdminOrContactAdmin,

    // Estado de la entidad
    isCompany,
    canAccessExpositionFeatures,

    // Métodos de verificación
    canAccess,

    // Constantes de roles para facilitar el uso
    ROLES,
  }
}
