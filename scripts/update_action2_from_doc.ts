import 'dotenv/config';

const baseId = process.env.AIRTABLE_BASE_ID!;
const pat = process.env.AIRTABLE_PAT!;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json',
};

async function airtableRequest(endpoint: string, method = 'GET', body?: any) {
  const url = `https://api.airtable.com/v0/${baseId}/${endpoint}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Airtable ${method} ${endpoint} failed: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log("=== UPDATING ACTION 2 IN AIRTABLE ===");

  const action2Id = 'recbYjt3Sykcj2Xg0';
  const pathway21Id = 'recYHYmT0t2O6FowD';
  const pathway22Id = 'recEU7spqUr33oM9S';

  // Cross-reference IDs
  const pathway11Id = 'recWGEx5x7YpvT9ZP';
  const pathway12Id = 'rec8KPHGxRyncsXYg';

  // 1. Update Action 2 Record
  console.log("1. Updating Action 2 record...");
  await airtableRequest(`Actions/${action2Id}`, 'PATCH', {
    fields: {
      'Title': 'Strengthen Enabling Environments for Climate Investment',
      'Description': 'This Action helps national governments to identify and address barriers to urban climate finance and implementation. These may include policy, financing, data and coordination barriers. Governments can use these findings to prioritize reforms that improve investment conditions for cities.',
      'Systems Logic': 'Mobilizing urban climate finance requires more than the availability of capital. Policies, institutions, fiscal frameworks, and regulatory conditions influence whether cities can prepare, finance, and implement climate projects. National governments can address systemic barriers that cities cannot resolve alone, including borrowing restrictions, regulatory constraints, and gaps in financial frameworks. Assessing these barriers and implementing targeted reforms can improve cities’ investment readiness, access to finance, and capacity to implement climate projects.'
    }
  });

  // 2. Update Pathways 2.1 & 2.2
  console.log("2. Updating Pathways 2.1 and 2.2...");
  const adapting21 = [
    'Match the scope and depth of the assessment to available institutional capacity. Where capacities are limited, begin with priority sectors or investment barriers and expand over time.',
    'Adapt the assessment to available data. Where climate, fiscal, or investment data are limited, use stakeholder consultations and qualitative evidence.',
    'Involve national and subnational institutions with the mandate, political support, and capacity to act on the findings so that assessments can inform reforms in investment conditions.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway21Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '2.1 Enabling Framework Conditions Assessments',
      'Overview': 'Enabling framework conditions assessments help national and subnational governments to systematically identify barriers to urban climate investment. Through evidence collection and stakeholder engagement, they reveal how existing conditions across data, finance, and governance affect investment and implementation across government levels. Findings can help governments identify reform priorities requiring coordinated national and subnational action.',
      'Potential National Lead': ['Urban / Local Government Ministry'],
      'Key Actors': [
        'Finance Ministry',
        'Climate / Environment Ministry',
        'City / Subnational Governments',
        'National Development Bank',
        'City Networks',
        'Academia / Research',
        'Technical Assistance Providers'
      ],
      'Adapting this pathway to your context': adapting21
    }
  });

  const adapting22 = [
    'Account for any parliamentary approvals, legislative changes, and intergovernmental agreements that may be needed to implement reforms.',
    'Adapt reform responsibilities to the country\'s governance structure. Centralized structures may require stronger national leadership, while decentralized structures may require greater subnational ownership and coordination.',
    'Consider fiscal space and municipal capacities. The availability of national grants, development finance and performance-linked incentives could catalyze municipal reforms. Municipalities with limited capacities may require phased reforms, technical assistance, and additional implementation support.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway22Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '2.2 Reform Roadmaps for Urban Climate Investment',
      'Overview': 'Enabling reforms help governments to address institutional barriers that constrain urban climate finance and implementation. Building on enabling framework conditions assessments, national and subnational governments can develop reform roadmaps that identify priority actions, institutional responsibilities, resources and implementation milestones. These roadmaps can help to sequence reforms across government institutions and coordinate financial and technical support for implementation.',
      'Potential National Lead': ['Finance Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': [
        'Planning Ministry',
        'Climate / Environment Ministry',
        'Relevant Sector Ministries',
        'City / Subnational Governments',
        'National Regulator',
        'National Development Bank',
        'MDB / DFI',
        'Technical Assistance Providers'
      ],
      'Adapting this pathway to your context': adapting22
    }
  });

  // 3. Update Implementation Guidance for Action 2
  console.log("3. Updating Implementation Guidance...");
  let allGuidance: any[] = [];
  let offset = '';
  do {
    const res = await airtableRequest(`Implementation%20Guidance?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allGuidance = allGuidance.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action2Guidance = allGuidance.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway21Id) || belongs.includes(pathway22Id);
  });

  console.log(`Deleting ${action2Guidance.length} existing guidance steps for Action 2...`);
  for (const g of action2Guidance) {
    await airtableRequest(`Implementation%20Guidance/${g.id}`, 'DELETE');
  }

  const newGuidance = [
    // 2.1
    {
      fields: {
        'Step Title': 'Define the scope of the assessment',
        'Step Order': 1,
        'Detailed Content': 'Identify the investment challenges the assessment should examine. Determine which institutions, government levels, and financing systems should be included.',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage subnational governments early',
        'Step Order': 2,
        'Detailed Content': 'While developing the purpose and scope of the assessment, involve cities and subnational authorities early to identify their specific investment challenges and priorities.',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Assess existing conditions',
        'Step Order': 3,
        'Detailed Content': 'Review relevant policies, fiscal systems, financing frameworks, institutional arrangements, and data, including alignment between NDCs, national urban policies, and relevant sectoral strategies. Validate findings through stakeholder consultations.',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Identify investment barriers',
        'Step Order': 4,
        'Detailed Content': 'Determine which policy, fiscal, institutional, financing, or data constraints are limiting urban climate investment. Distinguish national barriers from those that can be addressed locally.',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Validate findings across government levels',
        'Step Order': 5,
        'Detailed Content': 'Discuss findings with cities, subnational governments, and relevant national institutions. Use this process to confirm reform priorities, identify areas requiring joint action, and inform updates to shared climate commitments where relevant (see Pathway 1.1).',
        'Belongs to Pathway': [pathway21Id],
        'Related Pathways': [pathway11Id]
      }
    },
    {
      fields: {
        'Step Title': 'Prioritize areas for reform',
        'Step Order': 6,
        'Detailed Content': 'Identify which barriers have the greatest effect on investment and implementation. Use the findings to inform reform priorities, technical assistance, and financing support (see Pathway 2.2).',
        'Belongs to Pathway': [pathway21Id],
        'Related Pathways': [pathway22Id]
      }
    },
    {
      fields: {
        'Step Title': 'Repeat the assessment when needed',
        'Step Order': 7,
        'Detailed Content': 'Revisit priority areas as reforms progress and investment conditions change.',
        'Belongs to Pathway': [pathway21Id]
      }
    },

    // 2.2
    {
      fields: {
        'Step Title': 'Prioritize feasible reforms',
        'Step Order': 1,
        'Detailed Content': 'Identify barriers with the greatest effect on urban climate investment. Consider their urgency, political feasibility, and potential benefits (see Pathway 2.1).',
        'Belongs to Pathway': [pathway22Id],
        'Related Pathways': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Define priority actions',
        'Step Order': 2,
        'Detailed Content': 'Specify the actions required for each reform and identify the responsible national and subnational institutions. Define milestones, resources, and technical support where needed.',
        'Belongs to Pathway': [pathway22Id]
      }
    },
    {
      fields: {
        'Step Title': 'Identify dependencies',
        'Step Order': 3,
        'Detailed Content': 'Determine which reforms require national action and which can be implemented locally. Sequence connected reforms and use national coordination mechanisms to address institutional dependencies (see Pathway 1.2).',
        'Belongs to Pathway': [pathway22Id],
        'Related Pathways': [pathway12Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect reforms with finance',
        'Step Order': 4,
        'Detailed Content': 'Identify where public funding, development finance, technical assistance, or performance-based incentives can support implementation.',
        'Belongs to Pathway': [pathway22Id]
      }
    },
    {
      fields: {
        'Step Title': 'Track progress and revise',
        'Step Order': 5,
        'Detailed Content': 'Establish clear milestones and review progress periodically. Update priorities when reforms advance, or new barriers emerge.',
        'Belongs to Pathway': [pathway22Id]
      }
    }
  ];

  for (let i = 0; i < newGuidance.length; i += 10) {
    const chunk = newGuidance.slice(i, i + 10);
    await airtableRequest('Implementation%20Guidance', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newGuidance.length} guidance steps for Action 2.`);

  // 4. Update Key Resources (Peer Learning Examples & Tools)
  console.log("4. Updating Key Resources for Action 2...");
  let allResources: any[] = [];
  offset = '';
  do {
    const res = await airtableRequest(`Key%20Resources?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allResources = allResources.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action2Resources = allResources.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway21Id) || belongs.includes(pathway22Id);
  });

  console.log(`Deleting ${action2Resources.length} existing resources for Action 2...`);
  for (const r of action2Resources) {
    await airtableRequest(`Key%20Resources/${r.id}`, 'DELETE');
  }

  const newResources = [
    // 2.1
    {
      fields: {
        'Example Title': 'India – National Enabling Framework Conditions Assessment',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: India shows how a national assessment can identify policy, fiscal, data, and institutional barriers to urban climate finance and inform reform priorities.',
        'Full Text / Concept Explanation': "The National Enabling Framework Conditions assessment was piloted by GIZ in collaboration with India's Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs, and the Energy and Resources Institute. It included a desk review with seven stakeholder interviews and two roundtables in New Delhi attended by more than 80 participants. The assessment identified gaps across four dimensions, including local institutional mandates, own-source revenues and borrowings, city-level climate data, and coordination between state and local governments. Each gap points to a specific reform — broadening grants from the national finance commission to support climate action, for instance, or issuing city climate action plan guidelines under national missions.",
        'Learn More URL': 'https://citiesclimatefinance.org/publications/national-enabling-framework-conditions-assessment-india',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Example Title': 'Indonesia – Subnational Enabling Framework Conditions Assessment',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Indonesia shows how a subnational assessment can identify progress and gaps in policy, financing, and coordination and recommend improvements through multilevel action.',
        'Full Text / Concept Explanation': "Conducted under the Urban-Act project, the subnational National Enabling Framework Conditions assessment covered Medan City, Binjai City, and Deli Serdang Regency (Mebidang) in North Sumatra, Indonesia. It identified progress in integrating climate priorities into local development plans and using intergovernmental transfers for climate action. However, gaps remain in municipal climate budgeting, access to private and innovative finance, climate data, and coordination across government levels. The assessment recommended extending climate budget tagging to municipalities, strengthening local revenue and financing options, and establishing a coordination team led by North Sumatra's Development Planning Agency. These recommendations aim to strengthen local financing conditions and align climate planning and implementation across government levels.",
        'Learn More URL': 'https://repository.unescap.org/items/62396393-9771-4e91-9626-d0d4995034ce',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Example Title': 'India – Subnational Enabling Framework Conditions Assessment',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: India shows how a city-level assessment can identify barriers and opportunities for strengthening climate finance and coordination between state and municipal institutions.',
        'Full Text / Concept Explanation': "Conducted in Coimbatore, Tamil Nadu, the subnational National Enabling Framework Conditions assessment examined climate policy, budgeting and finance, climate data, and multilevel coordination. It identified existing strengths, including Tamil Nadu's climate policies and financing institutions, and Coimbatore's Climate Resilient City Action Plan. However, gaps remain in city-level climate budgeting, access to finance, climate data, and alignment between state and municipal planning. The assessment recommended strengthening climate budgeting, expanding state support for municipal climate investment, and improving coordination between state and city institutions.",
        'Learn More URL': 'https://repository.unescap.org/items/9e498d2b-8cec-477d-b045-85547cab3b17',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Example Title': 'National Enabling Framework Conditions Tool',
        'Type': 'Tool',
        'Order': 4,
        'What you can learn / Why use this': 'Why use this tool: Assess national policy, fiscal, and institutional barriers to urban climate finance and identify reform priorities requiring national action.',
        'Full Text / Concept Explanation': 'The tool assesses national enabling conditions for urban climate finance across four categories: policy, budget and finance, climate data, and vertical and horizontal coordination. Through evidence collection, stakeholder consultations, and analysis, the tool helps national governments understand existing enabling conditions, identify barriers to urban climate investment, and prioritize areas for reform.',
        'Learn More URL': 'https://citiesclimatefinance.org/wp-content/uploads/2024/07/National-Assessment-Tool.pdf',
        'Belongs to Pathway': [pathway21Id]
      }
    },
    {
      fields: {
        'Example Title': 'Subnational Enabling Framework Conditions (EFC) Tool',
        'Type': 'Tool',
        'Order': 5,
        'What you can learn / Why use this': 'Why use this tool: Assess local conditions affecting access to climate finance and identify improvements requiring subnational action.',
        'Full Text / Concept Explanation': 'The tool is designed primarily for subnational and municipal governments. It assesses enabling conditions for urban climate finance at the city, metropolitan, state, or regional level. Through evidence collection, stakeholder consultations, and analysis, it helps subnational governments identify strengths, investment barriers and areas for improvement. Used alongside the National EFC Tool, it helps identify barriers requiring action at different government levels.',
        'Learn More URL': 'https://citiesclimatefinance.org/wp-content/uploads/2024/07/Subnational-Assessment-tool.pdf',
        'Belongs to Pathway': [pathway21Id]
      }
    },

    // 2.2
    {
      fields: {
        'Example Title': 'South Africa – Metro Trading Services Reform Program',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: South Africa shows how national governments can connect municipal reform roadmaps with performance-linked financing to improve infrastructure investment conditions.',
        'Full Text / Concept Explanation': "The Metro Trading Services Reform Program, led by South Africa’s National Treasury in collaboration with relevant national departments, targets the country’s eight metropolitan municipalities. It provides performance-based conditional grants to incentivize improvements in water supply and sanitation, electricity and energy, and solid waste management. Participating municipalities develop Trading Services Reform Strategies, which include institutional roadmaps and business and investment plans that identify institutional changes, financing needs, and service delivery priorities. These strategies must be approved by the municipal council and also include city-level Performance Improvement Action Plans with measurable reform targets, against which progress is independently verified. A six-year ZAR 54 billion performance-linked grant provides incentives to participating municipalities, with funding tied to progress against agreed targets. By strengthening municipal governance, revenue management, and financial sustainability, the program aims to increase investment in essential urban infrastructure, including climate-relevant services.",
        'Learn More URL': 'https://csp.treasury.gov.za/news-events/south-african-government-launches-metro-trading-services-reform-to-strengthen-city-infrastructure-wednesday-18-march-2026?type=news',
        'Belongs to Pathway': [pathway22Id]
      }
    },
    {
      fields: {
        'Example Title': 'Uganda – Support to Municipal Infrastructure Development (USMID)',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Uganda shows how national governments can use institutional assessments, municipal improvement plans, and performance-linked financing to strengthen urban investment conditions.',
        'Full Text / Concept Explanation': 'Led by the Ministry of Lands, Housing, and Urban Development, USMID began in 2013 with 14 municipalities and later expanded to additional local governments. As part of USMID, technical, financial, and institutional assessments in local governments informed a Programme Action Plan, outlining corrective actions, institutional responsibilities, and implementation timelines. Municipalities also developed capacity-building plans addressing weaknesses in planning, revenue management, procurement, and infrastructure delivery. Annual performance assessments linked municipal infrastructure grants to improvements in institutional performance and implementation. USMID closed in 2024 with a satisfactory outcome rating. Building on this experience, Uganda secured USD 540 million in World Bank financing in 2026 for the successor Uganda Cities and Municipalities Infrastructure Development program, expanding support for municipal institutions and climate-smart infrastructure.',
        'Learn More URL': 'https://documents1.worldbank.org/curated/en/099121724101528052/pdf/BOSIB1b7203d7507e1a5e21f0720f8cefe3.pdf',
        'Belongs to Pathway': [pathway22Id]
      }
    },
    {
      fields: {
        'Example Title': 'The Brazil Climate Finance Reform Compass',
        'Type': 'Tool',
        'Order': 3,
        'What you can learn / Why use this': 'Why use this tool: See how a climate-finance reform framework can be tailored to national institutions, priorities, and decision-making processes.',
        'Full Text / Concept Explanation': 'The Brazil Climate Finance Reform Compass: The Compass adapts the global framework to the national context, identifying gaps and reform priorities across the same nine thematic areas and mapping the institutions, actors, and milestones needed to advance them. Both are designed as living tools that can be updated as policies, evidence, and stakeholder priorities evolve, helping governments and other stakeholders coordinate reforms, track progress, and strengthen alignment between climate finance and broader development priorities.',
        'Learn More URL': 'https://compass-brazil.climatepolicyinitiative.org/',
        'Belongs to Pathway': [pathway22Id]
      }
    }
  ];

  for (let i = 0; i < newResources.length; i += 10) {
    const chunk = newResources.slice(i, i + 10);
    await airtableRequest('Key%20Resources', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newResources.length} resources for Action 2.`);

  console.log("=== ACTION 2 AIRTABLE UPDATE COMPLETE ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
