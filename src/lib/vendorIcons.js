import { FaMicrosoft, FaAws } from 'react-icons/fa'
import { GrVmware, GrOracle } from 'react-icons/gr'
import { SlBadge } from 'react-icons/sl'
import {
  SiNutanix, SiBroadcom, SiGooglecloud, SiRedhat, SiSuse, SiKubernetes, SiCncf,
  SiLinuxfoundation, SiProxmox, SiDocker, SiHashicorp, SiAnsible, SiCisco, SiCitrix,
  SiVeeam, SiNetapp, SiFortinet, SiPaloaltonetworks, SiDell, SiHp, SiLenovo,
  SiComptia, SiRancher, SiPuppet,
} from 'react-icons/si'

export const GENERIC_BADGE_ICON = SlBadge

const VENDOR_ICONS = [
  [/nutanix/i, SiNutanix],
  [/vmware|vsphere|vcenter|esxi|\bvcp\b|vsan|\bnsx\b/i, GrVmware],
  [/broadcom/i, SiBroadcom],
  [/microsoft|azure|windows/i, FaMicrosoft],
  [/amazon|\baws\b/i, FaAws],
  [/google/i, SiGooglecloud],
  [/oracle/i, GrOracle],
  [/red ?hat|openshift|\brhce\b/i, SiRedhat],
  [/suse/i, SiSuse],
  [/kubernetes|\bcka\b|\bckad\b|\bcks\b/i, SiKubernetes],
  [/cncf/i, SiCncf],
  [/linux foundation|\blfcs\b/i, SiLinuxfoundation],
  [/proxmox/i, SiProxmox],
  [/docker/i, SiDocker],
  [/hashicorp|terraform/i, SiHashicorp],
  [/ansible/i, SiAnsible],
  [/cisco|\bccna\b|\bccnp\b/i, SiCisco],
  [/citrix/i, SiCitrix],
  [/veeam/i, SiVeeam],
  [/netapp/i, SiNetapp],
  [/fortinet/i, SiFortinet],
  [/palo ?alto/i, SiPaloaltonetworks],
  [/\bdell\b/i, SiDell],
  [/\bhp\b|hewlett/i, SiHp],
  [/lenovo/i, SiLenovo],
  [/comptia/i, SiComptia],
  [/rancher/i, SiRancher],
  [/puppet/i, SiPuppet],
]

export const vendorIcon = badge => {
  const text = `${badge.name} ${badge.issuer}`
  return VENDOR_ICONS.find(([re]) => re.test(text))?.[1] ?? GENERIC_BADGE_ICON
}
