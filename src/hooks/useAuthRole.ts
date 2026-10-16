// src/hooks/useAuthRole.ts
import { useState } from 'react';
import { ResponderRole } from '../types';
import { INITIAL_RESPONDER, AVAILABLE_JURISDICTIONS } from '../services/mockData';

export function useAuthRole() {
  const [responder, setResponder] = useState(INITIAL_RESPONDER);
  const [jurisdiction, setJurisdiction] = useState(INITIAL_RESPONDER.jurisdiction);

  const setRole = (role: ResponderRole) => {
    setResponder(prev => ({ ...prev, role }));
  };

  const permissions = {
    canView: true,
    canAnnotate: ['Analyst', 'Incident Reviewer', 'Authorized Approver', 'Administrator'].includes(responder.role),
    canConfirmReject: ['Incident Reviewer', 'Authorized Approver', 'Administrator'].includes(responder.role),
    canApprovePublicAlert: ['Authorized Approver', 'Administrator'].includes(responder.role),
    canAssignUnits: ['Incident Reviewer', 'Authorized Approver', 'Administrator'].includes(responder.role),
    isAdministrator: responder.role === 'Administrator',
  };

  return {
    responder,
    jurisdiction,
    setJurisdiction,
    setRole,
    permissions,
    availableJurisdictions: AVAILABLE_JURISDICTIONS,
    availableRoles: ['Viewer', 'Analyst', 'Incident Reviewer', 'Authorized Approver', 'Administrator'] as ResponderRole[],
  };
}
