import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLandingpage } from './admin-landingpage';

describe('AdminLandingpage', () => {
  let component: AdminLandingpage;
  let fixture: ComponentFixture<AdminLandingpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLandingpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLandingpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
