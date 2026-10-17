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
    canAnnotate: ['Incident Reviewer', 'District Emergency Operations Officer'].includes(responder.role),
    canConfirmReject: ['Incident Reviewer', 'District Emergency Operations Officer'].includes(responder.role),
    canApprovePublicAlert: responder.role === 'District Emergency Operations Officer',
    isDistrictOfficer: responder.role === 'District Emergency Operations Officer',
  };

  return {
    responder,
    jurisdiction,
    setJurisdiction,
    setRole,
    permissions,
    availableJurisdictions: AVAILABLE_JURISDICTIONS,
    availableRoles: ['Viewer', 'Incident Reviewer', 'District Emergency Operations Officer'] as ResponderRole[],
  };
}
